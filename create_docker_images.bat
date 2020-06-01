@echo off
set tag=v6.0.2
echo Build docker images for hinjri calendar version [%tag%]
docker build --rm -t mmbarek/hijri-calendar:%tag% ./hijri-calendar
docker push mmbarek/hijri-calendar:%tag%
docker build --rm -t mmbarek/hijri-calendar-api:%tag% ./hijri-calendar-api
docker push mmbarek/hijri-calendar-api:%tag%
