mkdir ./output
mkdir ./output/bitmex
docker stop tradingdata_bitmex
docker rm tradingdata_bitmex
docker run -d \
  --name tradingdata_bitmex \
  -v $PWD/output:/home/tradingdata/output \
  tradingdata node ./bin/bitmex.js