# -*- coding: utf-8 -*-
import logging
import requests
from unittest import TestCase
from time import sleep
import os
import shutil
import sqlite3

logger = logging.getLogger(__name__)


class TestJob(TestCase):
    """
    Test cases for Job model
    """

    # fixtures = ['admin_user', 'providers']

    def setUp(self):
        username = 'admin'
        password = '@dm1n'

        self.base_url = os.getenv('BASE_URL', 'http://cloud.eventkit.dev')
        self.login_url = self.base_url + '/en/login'
        self.create_export_url = self.base_url + '/en/exports/create'
        self.jobs_url = self.base_url + '/api/jobs'
        self.runs_url = self.base_url + '/api/runs'
        self.download_dir = os.path.join(os.getenv('EXPORT_STAGING_ROOT', '.'), "test")
        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir, mode=0660)
        self.client = requests.session()
        self.client.get(self.login_url)
        self.csrftoken = self.client.cookies['csrftoken']

        login_data = dict(username=username, password=password, csrfmiddlewaretoken=self.csrftoken, next='/')
        self.client.post(self.login_url, data=login_data, headers=dict(Referer=self.login_url),
                         auth=(username, password))
        self.client.get(self.base_url)
        self.client.get(self.create_export_url)
        self.csrftoken = self.client.cookies['csrftoken']

    def tearDown(self):
        if os.path.exists(self.download_dir):
            shutil.rmtree(self.download_dir)

    def test_only_osm(self):
        """
        This test is to ensure that an OSM file by itself only exporting GeoPackage returns data.
        :return:
        """
        job_data = {"csrfmiddlewaretoken": self.csrftoken, "name": "TestName", "description": "Test Description",
                    "event": "TestProject", "xmin": "-43.248067", "ymin": "-22.815982", "xmax": "-43.243861",
                    "ymax": "-22.812817", "tags": [],
                    "provider_tasks": [{"provider": "OpenStreetMap Data", "formats": ["gpkg"]}]}
        self.assertTrue(self.run_job(job_data))

    def test_all(self):
        """
        This test ensures that if all formats and all providers are selected that the test will finish.
        :return:
        """
        job_data = {"csrfmiddlewaretoken": self.csrftoken, "name": "TestMultiple",
                    "description": "Test Description", "event": "TestProject", "xmin": "-71.036471",
                    "ymin": "42.348130",
                    "xmax": "-71.035420", "ymax": "42.348891", "tags": [],
                    "provider_tasks": [{"provider": "ESRI-Imagery",
                                        "formats": ["shp", "thematic-shp",
                                                    "gpkg", "thematic-gpkg",
                                                    "kml", "sqlite",
                                                    "thematic-sqlite"]},
                                       {"provider": "OpenStreetMap Data",
                                        "formats": ["shp", "thematic-shp",
                                                    "gpkg", "thematic-gpkg",
                                                    "kml", "sqlite",
                                                    "thematic-sqlite"]},
                                       {"provider": "OpenStreetMap Tiles",
                                        "formats": ["shp", "thematic-shp",
                                                    "gpkg", "thematic-gpkg",
                                                    "kml", "sqlite",
                                                    "thematic-sqlite"]},
                                       {"provider": "USGS-Imagery",
                                        "formats": ["shp", "thematic-shp",
                                                    "gpkg", "thematic-gpkg",
                                                    "kml", "sqlite",
                                                    "thematic-sqlite"]}]}
        self.assertTrue(self.run_job(job_data))

    def run_job(self, data):

        response = self.client.post(self.jobs_url,
                                    json=data,
                                    headers={'X-CSRFToken': self.csrftoken,
                                             'Referer': self.create_export_url})
        self.assertEquals(response.status_code, 202)
        job = response.json()
        run = self.wait_for_run(job.get('uid'))
        self.assertTrue(run.get('status') == "COMPLETED")
        geopackage_file = self.download_file(self.get_gpkg_url(run, "OpenStreetMap Data"))
        self.assertTrue(os.path.isfile(geopackage_file))
        self.assertTrue(check_content_exists(geopackage_file))
        delete_response = self.client.delete(self.jobs_url + '/' + job.get('uid'),
                           headers={'X-CSRFToken': self.csrftoken, 'Referer': self.create_export_url})
        self.assertTrue()
        return True

    def wait_for_run(self, job_uid):
        finished = False
        response = None
        while not finished:
            sleep(5)
            response = self.client.get(self.runs_url,
                                       params={"job_uid": job_uid},
                                       headers={'X-CSRFToken': self.csrftoken}).json()
            status = response[0].get('status')
            if status == "COMPLETED" or status == "INCOMPLETE":
                finished = True
        return response[0]

    def download_file(self, url, download_dir=None):
        download_dir = download_dir or self.download_dir
        file_location = os.path.join(download_dir, os.path.basename(url))
        r = requests.get(url, stream=True)
        if r.status_code == 200:
            with open(file_location, 'wb') as f:
                for chunk in r:
                    f.write(chunk)
            return file_location
        return None

    def get_gpkg_url(self, run, provider_task_name):
        for provider_task in run.get("provider_tasks"):
            if provider_task.get('name') == provider_task_name:
                for task in provider_task.get('tasks'):
                    if task.get('name') == "Geopackage":
                        return task.get('result').get("url")
        return False


def get_table_count(gpkg, table):
    conn = sqlite3.connect(gpkg)
    cur = conn.cursor()
    if is_alnum(table):
        cur.execute("SELECT COUNT(*) FROM {0}".format(table))
        result = cur.fetchone()
        conn.close()
        return result[0]
    conn.close()
    return False


def get_table_names(gpkg):
    conn = sqlite3.connect(gpkg)
    cur = conn.cursor()
    result = cur.execute("SELECT TABLE_NAME FROM gpkg_contents;")
    table_names = [table for (table,) in result]
    conn.close()
    return table_names


def check_content_exists(gpkg):
    """

    :param gpkg: A geopackage file with data.
    :return: True if there is a single raster tile or feature is found.
    """
    for table in get_table_names(gpkg):
        if get_table_count(gpkg, table) > 0:
            return True
    return False


def is_alnum(data):
    """
    Used to ensure that only 'safe' data can be used to query or create data.
    >>> is_alnum("test")
    True
    >>> is_alnum("test_2")
    True
    >>> is_alnum(";")
    False
    >>> is_alnum("test 4")
    False
    @param: String of data to be tested.
    @return: if data is only alphanumeric or '_' chars.
    """
    import re
    if re.match(r'\w+$', data):
        return True
    return False