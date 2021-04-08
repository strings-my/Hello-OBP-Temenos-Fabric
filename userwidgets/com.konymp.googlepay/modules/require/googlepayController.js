define(function() {
  
    var PaymentsUtility = require('com/konymp/googlepay/PaymentsUtility');  
    var konyLoggerModule = require('com/konymp/googlepay/KonyLogger');
    var konymp = konymp || {};
    konymp.logger = (new konyLoggerModule("Google Pay Component")) || function() {};
    konymp.logger.setLogLevel("DEBUG");
    konymp.logger.enableServerLogging = true;
  return {
        
      
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      
      try{
            this.WalletConstants = java.import("com.google.android.gms.wallet.WalletConstants");
            this.ArrayList = java.import("java.util.ArrayList");
            
            this.PaymentsClient = java.import("com.google.android.gms.wallet.PaymentsClient");
         
            this.AutoResolveHelper = java.import("com.google.android.gms.wallet.AutoResolveHelper");
            this.PaymentData = java.import("com.google.android.gms.wallet.PaymentData");  
            
            
          this.VISA = 'VISA';
          this.AMEX = 'AMEX';
          this.DISCOVER = 'DISCOVER';
          this.INTERAC = 'INTERAC';
          this.JCB = 'JCB';
          this.MASTERCARD = 'MASTERCARD';
          this.OTHER = 'OTHER';
          this.CARD = 'CARD';
          this.TOKENIZED_CARD = 'TOKENIZED_CARD';
          this.UNKNOWN = 'UNKNOWN';
      
            this.Networks = {
                'VISA' : this.WalletConstants.CARD_NETWORK_VISA,
                'AMEX' : this.WalletConstants.CARD_NETWORK_AMEX,
                'DISCOVER' :  this.WalletConstants.CARD_NETWORK_DISCOVER,
                'INTERAC' :  this.WalletConstants.CARD_NETWORK_INTERAC,
                'JCB' :  this.WalletConstants.CARD_NETWORK_JCB,
                'MASTERCARD' :  this.WalletConstants.CARD_NETWORK_MASTERCARD,
                'OTHER' :  this.WalletConstants.CARD_NETWORK_OTHER
            };  
          
            
          
            this.Methods = {
                'CARD' : this.WalletConstants.PAYMENT_METHOD_CARD,
//                'TOKENIZATION_TYPE_DIRECT' : WalletConstants.PAYMENT_METHOD_TOKENIZATION_TYPE_DIRECT,
//                'TOKENIZATION_TYPE_NETWORK_TOKEN' : WalletConstants.PAYMENT_METHOD_TOKENIZATION_TYPE_NETWORK_TOKEN,
//                'TOKENIZATION_TYPE_PAYMENT_GATEWAY' : WalletConstants.PAYMENT_METHOD_TOKENIZATION_TYPE_PAYMENT_GATEWAY,
                'TOKENIZED_CARD' : this.WalletConstants.PAYMENT_METHOD_TOKENIZED_CARD,
                'UNKNOWN' : this.WalletConstants.PAYMENT_METHOD_UNKNOWN
            };
          
            this.Constants = {
                _GATEWAY_TOKENIZATION_NAME : "",
                _GATEWAY_TOKENIZATION_PARAMETERS : null,
                _DIRECT_TOKENIZATION_PUBLIC_KEY : null,

                _PAYMENTS_ENVIRONMENT : this.WalletConstants.ENVIRONMENT_TEST,
                _SUPPORTED_NETWORKS : null,
                _SUPPORTED_METHODS : null,
                _CURRENCY_CODE : "",
                _SHIPPING_SUPPORTED_COUNTRIES : null,
                _PHONE_NUMBER_REQUIRED : true,
                _EMAIL_REQUIRED : true,
                _PRICE : null,
              LOAD_PAYMENT_DATA_REQUEST_CODE : 891,
                _ALLOW_PREPAID_CARDS :  true,
                _BILLING_ADDRESS_REQUIRED : true
            };
          
            
            
            
          
            this.KonyMain = java.import('com.konylabs.android.KonyMain');
            this.context = this.KonyMain.getActivityContext();
            this.activity = this.KonyMain.getActContext();
              
            this.registerOnActivityResult();
            //kony.print("#####before creatingclient");
            this.mPaymentsClient = PaymentsUtility.createPaymentsClient(this.activity, this.Constants);
            //kony.print("#####after creatingclient");
    
      }
      catch(exception){
        konymp.logger.error("#####Exception in construction : " + exception.message, konymp.logger.EXCEPTION);
      }
    },
    //Logic for getters/setters of custom properties
      
        networksGetters  : function(obj){
          try{
            if(obj === this.WalletConstants.CARD_NETWORK_VISA){
              return this.VISA;
            }
            else if(obj === this.WalletConstants.CARD_NETWORK_MASTERCARD){
              return this.MASTERCARD;
            }                     
            else if(obj === this.WalletConstants.CARD_NETWORK_AMEX){
              return this.AMEX;
            }
            else if(obj === this.WalletConstants.CARD_NETWORK_DISCOVER){
              return this.DISCOVER;
            }
            else if(obj === this.WalletConstants.CARD_NETWORK_JCB){
              return this.JCB;
            }
            else if(obj === this.WalletConstants.CARD_NETWORK_INTERAC){
              return this.INTERAC;
            }
            else if(obj === this.WalletConstants.CARD_NETWORK_OTHER){
              return this.OTHER;
            }
          }
          catch(exception){
            konymp.logger.error("#####Exception in networkgetter function : " + exception.message, konymp.logger.EXCEPTION);
          }
        },
      
        methodsGetters : function (obj){
          try{
          if(obj === this.WalletConstants.PAYMENT_METHOD_CARD){
            return this.CARD;
          }
          else if(obj === this.WalletConstants.PAYMENT_METHOD_TOKENIZED_CARD){
            return this.TOKENIZED_CARD;
          }
          else if(obj === this.WalletConstants.PAYMENT_METHOD_UNKNOWN){
            return this.UNKNOWN;
          }
          }
          catch(exception){
            konymp.logger.error("#####Exception in method getter : " + exception.message, konymp.logger.EXCEPTION);
          }
       },
      
    initGettersSetters: function() {
      defineSetter(this, 'gateway', function (val){
        konymp.logger.trace("----------Entering gateway setter---------", konymp.logger.FUNCTION_ENTRY);
          if (val !== undefined && val !== null && val !== "") {
            this.Constants._GATEWAY_TOKENIZATION_NAME = val;
          } else {
            throw {
              message: 'wrong data passed for dataToEncode',
              Error: 'Wrong dataToEncode'
            };
          }
        
      });
          
            defineGetter(this, 'gateway', function(){
               konymp.logger.trace("----------Entering gateway getter---------", konymp.logger.FUNCTION_ENTRY);
              return this.Constants._GATEWAY_TOKENIZATION_NAME;
            });
          
            defineSetter(this, 'paymentsEnvironment', function(val){
               konymp.logger.trace("----------Entering Payment Enviroment setter---------", konymp.logger.FUNCTION_ENTRY);
                if(val === "ENVIRONMENT_TEST"){
                  this.Constants._PAYMENTS_ENVIRONMENT = this.WalletConstants.ENVIRONMENT_TEST;
                }
                else{
                  this.Constants._PAYMENTS_ENVIROMENT = this.WalletConstants.ENVIROMENT_PRODUCTION;
                }
            });
            
            defineGetter(this, 'paymentsEnvironment', function(){
               konymp.logger.trace("----------Entering payment Enviroment getter---------", konymp.logger.FUNCTION_ENTRY);
              if(this.Constants._PAYMENTS_ENVIRONMENT === this.WalletConstants.ENVIRONMENT_TEST){
                return "ENVIRONMENT_TEST";
              }
              else{
                return "ENVIRONMENT_PRODUCTION";
              }
            });
          
            defineSetter(this, 'currencyCode', function(val){
               konymp.logger.trace("----------Entering currencyCode setter---------", konymp.logger.FUNCTION_ENTRY);
                if (val !== undefined && val !== null && val !== "") {
                  this.Constants._CURRENCY_CODE = val;
                } else {
                  throw {
                    message: 'wrong data passed for dataToEncode',
                    Error: 'Wrong dataToEncode'
                  };
                }
            });
          
            defineGetter(this, 'currencyCode', function(){
               konymp.logger.trace("----------Entering currencyCode getter---------", konymp.logger.FUNCTION_ENTRY);
              return this.Constants._CURRENCY_CODE;
            });
          
          
            defineSetter(this, 'isPhoneNumberRequired', function(val){
               konymp.logger.trace("----------Entering phone number required setter---------", konymp.logger.FUNCTION_ENTRY);
                this.Constants._PHONE_NUMBER_REQUIRED = val;
            });
          
            defineGetter(this, 'isPhoneNumberRequired', function(){
               konymp.logger.trace("----------Entering phone number required getter---------", konymp.logger.FUNCTION_ENTRY);
                return this.Constants._PHONE_NUMBER_REQUIRED;
            });
          
            defineSetter(this, 'isEmailRequired', function(val){
               konymp.logger.trace("----------Entering email required setter---------", konymp.logger.FUNCTION_ENTRY);
                this.Constants._EMAIL_REQUIRED = val;
            });
            
            defineGetter(this, 'isEmailRequired', function(){
               konymp.logger.trace("----------Entering email required getter---------", konymp.logger.FUNCTION_ENTRY);
                return this.Constants._EMAIL_REQUIRED;
            });
            
            defineSetter(this, 'totalPrice', function(val){
               konymp.logger.trace("----------Entering total price setter---------", konymp.logger.FUNCTION_ENTRY);
                if(val !== undefined && val !== null){
                  if(isNaN(val) === false){
                    if(parseFloat(val) >= 0){
                      this.Constants._PRICE = val;                      
                    }
                  }
                }
            });
          
            defineGetter(this, 'totalPrice', function(){
               konymp.logger.trace("----------Entering total price getter---------", konymp.logger.FUNCTION_ENTRY);
                return this.Constants._PRICE;
            });
          
            defineSetter(this, 'allowPrepaidCards', function(val){
               konymp.logger.trace("----------Entering allow prepaid card setter---------", konymp.logger.FUNCTION_ENTRY);
                this.Constants._ALLOW_PREPAID_CARDS = val;
            });
          
            defineGetter(this, 'allowPrepaidCards', function(){
               konymp.logger.trace("----------Entering allow prepaid card getter---------", konymp.logger.FUNCTION_ENTRY);
                return this.Constants._ALLOW_PREPAID_CARDS;
            });
          
            defineSetter(this, 'isBillingAddressRequired', function(val){
               konymp.logger.trace("----------Entering billing address required setter---------", konymp.logger.FUNCTION_ENTRY);
                this.Constants._BILLING_ADDRESS_REQUIRED = val;
            });
          
            defineGetter(this, 'isBillingAddressRequired', function(){
               konymp.logger.trace("----------Entering billing address required getter---------", konymp.logger.FUNCTION_ENTRY);
                return this.Constants._BILLING_ADDRESS_REQUIRED;
            });
          
            defineSetter(this, 'gatewayParameters', function(val){
               konymp.logger.trace("----------Entering gateway parameters setter---------", konymp.logger.FUNCTION_ENTRY);
                var data = val.data;

                if(data.length !== 0){
                    this.Constants._GATEWAY_TOKENIZATION_PARAMETERS = [];
                    for(var i = 0; i < data.length; i++){
                        var param = [data[i].key, data[i].value];
                        this.Constants._GATEWAY_TOKENIZATION_PARAMETERS.push(param);
                    }
                }

            });
          
            defineGetter(this, 'gatewayParameters', function(){
               konymp.logger.trace("----------Entering gateway parameters getter---------", konymp.logger.FUNCTION_ENTRY);
                var resp = {};
                var data = [];
                for(var i = 0; i < this.Constants._GATEWAY_TOKENIZATION_PARAMETERS.length; i++){
                    var t = {};
                    t.key = this.Constants._GATEWAY_TOKENIZATION_PARAMETERS[i][0];
                    t.value = this.Constants._GATEWAY_TOKENIZATION_PARAMETERS[i][1];
                    data.push(t);
                }
                resp.data = data;
                return resp;
            });
          
            defineSetter(this, 'supportedNetworks', function(val){
               konymp.logger.trace("----------Entering supported networks setter---------", konymp.logger.FUNCTION_ENTRY);
                var data = val.data;

                if(data.length !== 0){
                    this.Constants._SUPPORTED_NETWORKS = new this.ArrayList();
                    for(var i = 0; i < data.length; i++){
                        this.Constants._SUPPORTED_NETWORKS.add(this.Networks[data[i].networks]);
                    }
                }

            });
          
            defineGetter(this, 'supportedNetworks', function(){
               konymp.logger.trace("----------Entering supported networks getter---------", konymp.logger.FUNCTION_ENTRY);
                var resp = {};
                var data = [];
                for(var i = 0; i < this.Constants._SUPPORTED_NETWORKS.size(); i++){
                    var t = {};
                    t.networks = this.networksGetters(this.Constants._SUPPORTED_NETWORKS.get(i));
                    data.push(t);
                }
                resp.data = data;
                return resp;
            });
          
            defineSetter(this, 'supportedMethods', function(val){
               konymp.logger.trace("----------Entering supported methods setter---------", konymp.logger.FUNCTION_ENTRY);
                var data = val.data;
                if(data.length !== 0){
                    this.Constants._SUPPORTED_METHODS = new this.ArrayList();
                    for(var i = 0; i < data.length; i++){
                      kony.print("########for loop" + data[i].methods);
                        this.Constants._SUPPORTED_METHODS.add(this.Methods[data[i].methods]);
                    }
                }
              //kony.print('#####' + this.methodsGetters(this.Constants._SUPPORTED_METHODS.get(0)));
            });
          
            defineGetter(this, 'supportedMethods', function(){
               konymp.logger.trace("----------Entering supported methods getter---------", konymp.logger.FUNCTION_ENTRY);
                var resp = {};
                var data = [];
                for(var i = 0; i < this.Constants._SUPPORTED_METHODS.size(); i++){
                    var t = {};
                    
                    t.methods = this.methodsGetters(this.Constants._SUPPORTED_METHODS.get(i));
                    data.push(t);
                }
                resp.data = data;
                return resp;
            });
          
            defineSetter(this, 'shippingCountries', function(val){
               konymp.logger.trace("----------Entering shipping supported countries setter---------", konymp.logger.FUNCTION_ENTRY);
                var data = val.data;
                if(data.length !== 0){
                    this.Constants._SHIPPING_SUPPORTED_COUNTRIES = new this.ArrayList();
                    for(var i = 0; i < data.length; i++){
                        this.Constants._SHIPPING_SUPPORTED_COUNTRIES.add(data[i].countryCode);
                    }
                }
                
            });
          
            defineGetter(this, 'shippingCountries', function(){
               konymp.logger.trace("----------Entering shipping supported countries getter---------", konymp.logger.FUNCTION_ENTRY);
                var resp = {};
                var data = [];
                for(var i = 0; i < this.Constants._SHIPPING_SUPPORTED_COUNTRIES.size(); i++){
                    var t = {};
                    t.countryCode = this.Constants._SHIPPING_SUPPORTED_COUNTRIES.get(i);
                    data.push(t);
                }
                resp.data = data;
                return resp;
            });
    },
      
    onActivityFunction : function(requestCode,resultCode,data){
      try{
        if(resultCode === -1){  
          var PaymentData = java.import("com.google.android.gms.wallet.PaymentData");  
          var paymentData = PaymentData.getFromIntent(data);
          this.handlePaymentSuccess(paymentData);
        }
        else if(resultCode === 0){
          // do nothing . user just cancelled the transaction.
        }
        else if(resultCode === 1){
          var status = this.AutoResolveHelper.getStatusFromIntent(data);
          this.handlePaymentFailure(status);
        }
      }
      catch(exception){
        konymp.logger.error("#####Exception in onActivityFunction : " + exception.message, konymp.logger.EXCEPTION);
      }
    },
    
        registerOnActivityResult : function(){
          try{
            var MainClass = java.newClass("MainClass","java.lang.Object",["com.konylabs.ffi.ActivityResultListener"],{
              onActivityResult : this.onActivityFunction.bind(this)
            });
            var intentClassObj = new MainClass();
            this.context.registerActivityResultListener(this.Constants.LOAD_PAYMENT_DATA_REQUEST_CODE, intentClassObj);
      
          }
          catch(exception){
            konymp.logger.error("#####Exception in registerOnActivityResult : " + exception.message, konymp.logger.EXCEPTION);
          }
        },
      
    
      
        setAllValues : function(params){
          try{
            if(params.totalPrice !== undefined){
                this.totalPrice = params.totalPrice;
            }
            else if(params.currencyCode !== undefined){
                this.currencyCode = params.currencyCode;
            }
            else if(params.supportedNetworks !== undefined){
                this.supportedNetworks = params.supportedNetworks;
            }
            else if(params.supportedMethods !== undefined){
                this.supportedMethods = params.supportedMethods;
            }
            else if(params.shippingCountries !== undefined){
                this.shippingCountries = params.shippingCountries;
            }
            else if(params.allowPrepaidCards !== undefined){
                this.allowPrepaidCards = params.allowPrepaidCards;
            }
            else if(params.isBillingAddressRequired !== undefined){
                this.isBillingAddressRequired = params.isBillingAddressRequired;
            }
            else if(params.isPhoneNumberRequired !== undefined){
                this.isPhoneNumberRequired = params.isPhoneNumberRequired;
            }
            else if(params.isEmailRequired !== undefined){
                this.isEmailRequired = params.isEmailRequired;
            }
            else if(params.gateway !== undefined){
                this.gateway = params.gateway;
            }
            else if(params.gatewayParameters !== undefined){
                this.gatewayParameters = params.gatewayParameters;
            }
          }
          catch(exception){
            konymp.logger.error("#####Exception in setAllValues : " + exception.message, konymp.logger.EXCEPTION);
          }
        },
      
        startPayment : function(params){
           konymp.logger.trace("----------Entering start payment---------", konymp.logger.FUNCTION_ENTRY);
          try{  
            this.setAllValues(params);
            
            if(this.Constants._SUPPORTED_NETWORKS === null){
              throw {
                message: 'Supported Networks cannot be null',
                Error: 'Supported Networks is null'
                };
            }
          
            else if(this.Constants._SUPPORTED_METHODS === null){
              throw {
                message: 'Supported Methods cannot be null',
                Error: 'Supported Methods is null'
              };
            }
          
            else if(this.Constants._GATEWAY_TOKENIZATION_PARAMETERS === null){
              throw {
                message: 'Gateway Parameters cannot be null',
                Error: 'Gateway Parameters is null'
              };
            }
            else if(this.Constants._PRICE === null){
                 throw {
                    message: 'Amount cannot be null',
                    Error: 'Amount is null'
                  };
            }
            else{
//               var tasks = PaymentsUtility.isReadyToPay(this.mPaymentsClient, this.Constants);
//               if(tasks.getResult() === false){
//                 throw {
//            message: 'Unfortunately Google Pay not available on your device',
//            Error: 'Google Pay not available'
//          };
//               }
//               else{
                var transaction = PaymentsUtility.createTransaction(this.Constants);
                var request = PaymentsUtility.createPaymentDataRequest(transaction , this.Constants);
                var futurePaymentData = this.mPaymentsClient.loadPaymentData(request);

                this.AutoResolveHelper.resolveTask(futurePaymentData, this.activity, this.Constants.LOAD_PAYMENT_DATA_REQUEST_CODE);
              
//              } 
            }
           konymp.logger.trace("----------Exiting start payment ---------", konymp.logger.FUNCTION_EXIT);
          }catch(exception){
            konymp.logger.error("#####Exception in start payment : " + exception.message, konymp.logger.EXCEPTION);
          }
        },
      
        
  };
});