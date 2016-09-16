#!/bin/bash

sudo groupadd eventkit
sudo useradd -g eventkit eventkit

sudo apt-get update
sudo apt-get -y install python-pip
sudo apt-get -y install vim
sudo apt-get -y install git

sudo pip install --upgrade pip
sudo pip install virtualenvwrapper
sudo echo 'export WORKON_HOME=/var/lib/eventkit/.virtualenvs' >> /etc/profile.d/path.sh
sudo echo 'export PROJECT_HOME=/var/lib/eventkit' >> /etc/profile.d/path.sh
sudo echo 'source /usr/local/bin/virtualenvwrapper.sh' >> /etc/profile.d/path.sh
source /etc/profile.d/path.sh
mkvirtualenv eventkit
sudo mkdir /var/lib/eventkit
workon eventkit

sudo apt-get -y install libpq-dev python-dev

sudo apt-get -y install gcc g++

cd /var/lib/eventkit
sudo git clone https://gitlab.com/osm-c-tools/osmctools.git
cd osmctools/src
sudo gcc osmupdate.c -o ../osmupdate
sudo gcc osmfilter.c -O3 -o ../osmfilter
sudo gcc osmconvert.c -lz -O3 -o ../osmconvert
cd ..
sudo cp osmupdate osmfilter osmconvert /usr/local/bin
cd ..
sudo rm -fr osmctools
cd ~

sudo apt-get -y install software-properties-common
sudo add-apt-repository -y ppa:ubuntugis/ubuntugis-unstable
sudo apt-get update
sudo apt-get -y install gdal-bin libgdal-dev libgeos-dev libspatialite-dev libspatialite5 libgeos-c1v5

sudo apt-get -y install osmctools
sudo apt-get -y install spatialite-bin libspatialite7 libspatialite-dev
sudo apt-get -y install zip unzip

mkdir /var/lib/eventkit/tmp
cd /var/lib/eventkit/tmp
sudo git clone https://github.com/terranodo/eventkit-cloud.git
cd eventkit-cloud
cp -R * /var/lib/eventkit
cd /var/lib/eventkit
sudo apt-get -y install libxml2-dev libxslt-dev
export CPLUS_INCLUDE_PATH=/usr/include/gdal
export C_INCLUDE_PATH=/usr/include/gdal
pip install -r requirements.txt
pip install -r requirements-dev.txt

sudo mkdir /var/lib/eventkit/exports_stage
sudo mkdir /var/lib/eventkit/exports_download
sudo mkdir /var/lib/eventkit/db_dir
sudo chown eventkit:eventkit -R /var/lib/eventkit/

sudo mkdir /var/log/eventkit

sudo apt-get install -y supervisor

sudo mv /var/lib/eventkit/tmp/eventkit-cloud/config/supervisord-celery.conf /etc/supervisor/supervisord.conf

sudo chmod 755 /home
sudo chmod 755 /var/lib/eventkit
sudo chmod 755 /var/lib/eventkit
sudo chmod 775 /var/log/eventkit
sudo chown -R eventkit:eventkit /var/lib/eventkit /var/log/eventkit /var/log/supervisor.log

sudo service supervisor restart
sudo update-rc.d supervisor enable
sudo chown -R eventkit:eventkit /var/log/eventkit

rm -rf /var/lib/eventkit/tmp