define(function () {
  	
  	var Wallet = java.import("com.google.android.gms.wallet.Wallet");
    var PaymentMethodTokenizationParameters = java.import("com.google.android.gms.wallet.PaymentMethodTokenizationParameters");
    var PaymentDataRequest = java.import("com.google.android.gms.wallet.PaymentDataRequest");
    var ShippingAddressRequirements = java.import("com.google.android.gms.wallet.ShippingAddressRequirements");
    var CardRequirements = java.import("com.google.android.gms.wallet.CardRequirements");
    var WalletConstants = java.import("com.google.android.gms.wallet.WalletConstants");
    var IsReadyToPayRequest = java.import("com.google.android.gms.wallet.IsReadyToPayRequest");
    var TransactionInfo = java.import("com.google.android.gms.wallet.TransactionInfo");
  
    return {
        createPaymentsClient : function(activity , Constants){
          var walletOptions = new Wallet.WalletOptions.Builder().setEnvironment
          (Constants._PAYMENTS_ENVIRONMENT).build();
          return Wallet.getPaymentsClient(activity, walletOptions);

        },

        createPaymentDataRequest : function(transactionInfo, Constants){
          var paramBuilder = PaymentMethodTokenizationParameters.newBuilder()
                                .setPaymentMethodTokenizationType(
                                        WalletConstants.PAYMENT_METHOD_TOKENIZATION_TYPE_PAYMENT_GATEWAY)
                                .addParameter("gateway", Constants._GATEWAY_TOKENIZATION_NAME);
          //kony.print("######"+ kony.Constants.GATEWAY_TOKENIZATION_PARAMETERS.length);
          for(var i = 0; i < Constants._GATEWAY_TOKENIZATION_PARAMETERS.length; i++){
            //kony.print("#####"+kony.Constants.GATEWAY_TOKENIZATION_PARAMETERS[i].first);
           // kony.print("#####"+kony.Constants.GATEWAY_TOKENIZATION_PARAMETERS[i].second);

            paramBuilder.addParameter(Constants._GATEWAY_TOKENIZATION_PARAMETERS[i][0] , Constants._GATEWAY_TOKENIZATION_PARAMETERS[i][1]);
          }
          var params = paramBuilder.build();
          
          var request = PaymentDataRequest.newBuilder();
          request.setPhoneNumberRequired(Constants._PHONE_NUMBER_REQUIRED)
                        .setEmailRequired(Constants._EMAIL_REQUIRED);
          if(Constants._SHIPPING_SUPPORTED_COUNTRIES !== null){
            	request.setShippingAddressRequired(true)
                        .setShippingAddressRequirements(
                            ShippingAddressRequirements.newBuilder()
                            .addAllowedCountryCodes(Constants._SHIPPING_SUPPORTED_COUNTRIES)
                            .build()
                        );
          }
                        
          request.setTransactionInfo(transactionInfo)
                        .addAllowedPaymentMethods(Constants._SUPPORTED_METHODS)
          				.setCardRequirements(
                            CardRequirements.newBuilder()
                            .addAllowedCardNetworks(Constants._SUPPORTED_NETWORKS)
                            .setAllowPrepaidCards(Constants._ALLOW_PREPAID_CARDS)
                            .setBillingAddressRequired(Constants._BILLING_ADDRESS_REQUIRED)
                            .setBillingAddressFormat(WalletConstants.BILLING_ADDRESS_FORMAT_FULL)
                            .build()
                        )
                        .setPaymentMethodTokenizationParameters(params)
                        .setUiRequired(true);
          return request.build();
         
        },

        isReadyToPay : function(client,Constants){
          var request = IsReadyToPayRequest.newBuilder();
          for(var i = 0; i < Constants._SUPPORTED_METHODS.length; i++){
            request.addAllowedPaymentMethod(Constants._SUPPORTED_METHODS[i]);
          }

          return client.isReadyToPay(request.build());
        },


        createTransaction : function(Constants){
          return TransactionInfo.newBuilder()
                    .setTotalPriceStatus(WalletConstants.TOTAL_PRICE_STATUS_FINAL)
                    .setTotalPrice(Constants._PRICE)
                    .setCurrencyCode(Constants._CURRENCY_CODE)
                    .build();
        },

    };
});