mkdir ./output
mkdir ./output/bitmex
docker stop tradingdata_bitmex
docker run --rm \
  --name tradingdata_bitmex \
  tradingdata node ./bin/bitmex.js