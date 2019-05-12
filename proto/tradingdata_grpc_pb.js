// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var proto_tradingdata_pb = require('../proto/tradingdata_pb.js');

function serialize_tradingdatapb_ReplySendTradeData(arg) {
  if (!(arg instanceof proto_tradingdata_pb.ReplySendTradeData)) {
    throw new Error('Expected argument of type tradingdatapb.ReplySendTradeData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_tradingdatapb_ReplySendTradeData(buffer_arg) {
  return proto_tradingdata_pb.ReplySendTradeData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_tradingdatapb_SendTradeData(arg) {
  if (!(arg instanceof proto_tradingdata_pb.SendTradeData)) {
    throw new Error('Expected argument of type tradingdatapb.SendTradeData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_tradingdatapb_SendTradeData(buffer_arg) {
  return proto_tradingdata_pb.SendTradeData.deserializeBinary(new Uint8Array(buffer_arg));
}


// TradingDataService - tradingdata service
var TradingDataServiceService = exports.TradingDataServiceService = {
  // translate - translate text
  sendTradeData: {
    path: '/tradingdatapb.TradingDataService/sendTradeData',
    requestStream: false,
    responseStream: false,
    requestType: proto_tradingdata_pb.SendTradeData,
    responseType: proto_tradingdata_pb.ReplySendTradeData,
    requestSerialize: serialize_tradingdatapb_SendTradeData,
    requestDeserialize: deserialize_tradingdatapb_SendTradeData,
    responseSerialize: serialize_tradingdatapb_ReplySendTradeData,
    responseDeserialize: deserialize_tradingdatapb_ReplySendTradeData,
  },
};

exports.TradingDataServiceClient = grpc.makeGenericClientConstructor(TradingDataServiceService);
