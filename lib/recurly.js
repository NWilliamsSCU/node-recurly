(function() {
  var js2xmlparser = require('js2xmlparser'),
      Client = require('./client'),
      utils = require('./utils'),
      router = require('./routes/');

  module.exports = function(config) {
		var routes = router.routes(config.apiVersion ? config.apiVersion : '2');
		var client = Client.create(config);

    // https://dev.recurly.com/docs/account-object
    this.accounts = {
      list: function(filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addQueryParams(routes.accounts.list, filter),
          callback
        );
      },
      get: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.accounts.get,
            { account_code: accountcode }
          ),
          callback
        );
      },
      create: function(details, callback) {
        client.request(
          routes.accounts.create,
          js2xmlparser('account', details),
          callback
        );
      },
      update: function(accountcode, details, callback) {
        client.request(
          utils.addParams(
            routes.accounts.update,
            { account_code: accountcode }
          ),
          js2xmlparser('account', details),
          callback
        );
      },
      close: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.accounts.close,
            { account_code: accountcode }
          ),
          callback
        );
      },
      reopen: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.accounts.reopen,
            { account_code: accountcode }
          ),
          callback
        );
      },
      notes: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.accounts.notes,
            { account_code: accountcode }
          ),
          callback
        );
      }
    }

    // https://dev.recurly.com/docs/list-an-accounts-adjustments
    this.adjustments = {
      list: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.adjustments.list,
            { account_code: accountcode }
          ),
          callback
        );
      },
      get: function(uuid, callback) {
        client.request(
          utils.addParams(
            routes.adjustments.get,
            { uuid: uuid }
          ),
          callback
        );
      },
      create: function(accountcode, details, callback) {
        client.request(
          utils.addParams(
            routes.adjustments.create,
            { account_code: accountcode }
          ),
          js2xmlparser('adjustment',details),
          callback
        );
      },
      remove: function(uuid, callback) {
        client.request(
          utils.addParams(
            routes.adjustments.remove,
            { uuid: uuid }
          ),
          callback
        );
      }
    }

    // https://dev.recurly.com/docs/lookup-an-accounts-billing-info
    this.billingInfo = {
      update: function(accountcode, details, callback) {
        client.request(
          utils.addParams(
            routes.billingInfo.update,
            { account_code: accountcode }
          ),
          js2xmlparser('billing_info', details),
          callback
        );
      },
      create: function(accountcode, details, callback) {
        client.request(
          utils.addParams(
            routes.billingInfo.update,
            { account_code: accountcode }
          ),
          js2xmlparser('billing_info', details),
          callback
        );
      },
      get: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.billingInfo.get,
            { account_code: accountcode }
          ),
          callback
        );
      },
      remove: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.billingInfo.remove,
            { account_code: accountcode }
          ),
          callback
        );
      }
    }

    // https://dev.recurly.com/docs/list-active-coupons
    this.coupons = {
      list: function(filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addQueryParams(routes.coupons.list, filter),
          callback
        );
      },
      get: function(couponcode, callback) {
        client.request(
          utils.addParams(
            routes.coupons.get,
            { coupon_code: couponcode }
          ),
          callback
        );
      },
      create: function(details, callback) {
        client.request(
          routes.coupons.create,
          js2xmlparser('coupon', details),
          callback
        );
      },
      deactivate: function(couponcode, callback) {
        client.request(
          utils.addParams(
            routes.coupons.deactivate,
            { coupon_code: couponcode }
          ),
          callback
        );
      }
    }

    // https://dev.recurly.com/docs/lookup-a-coupon-redemption-on-an-account
    this.couponRedemption = {
      redeem: function(couponcode, details, callback) {
        client.request(
          utils.addParams(
            routes.couponRedemption.redeem,
            { coupon_code: couponcode }
          ),
          js2xmlparser('redemption', details),
          callback
        );
      },
      get: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.couponRedemption.get,
            { account_code: accountcode }
          ),
          callback
        );
      },
      remove: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.couponRedemption.remove,
            { account_code: accountcode }
          ),
          callback
        );
      },
      getByInvoice: function(invoicenumber, callback) {
        client.request(
          utils.addParams(
            routes.couponRedemption.getByInvoice,
            { invoice_number: invoicenumber }
          ),
          callback
        );
      }
    }

    // https://dev.recurly.com/docs/list-invoices
    this.invoices = {
      list: function(filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addQueryParams(routes.invoices.list, filter),
          callback
        );
      },
      listByAccount: function(accountcode, filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addParams(
            utils.addQueryParams(routes.invoices.listByAccount, filter),
            { account_code: accountcode }
          ),
          callback
        );
      },
      get: function(invoicenumber, callback) {
        client.request(
          utils.addParams(
            routes.invoices.get,
            { invoice_number: invoicenumber }
          ),
          callback
        );
      },
      create: function(accountcode, details, callback) {
        client.request(
          utils.addParams(
            routes.invoices.create,
            { account_code: accountcode }
          ),
          js2xmlparser('invoice', details),
          callback
        );
      },
      preview: function(accountcode, callback) {
        client.request(
          utils.addParams(
            routes.invoices.preview,
            { account_code: accountcode }
          ),
          callback
        );
      },
      refundLineItems: function(invoicenumber, details, callback) {
        client.request(
          utils.addParams(
            routes.invoices.refundLineItems,
            { invoice_number: invoicenumber }
          ),
          js2xmlparser('invoice', details),
          callback
        );
      },
      refundOpenAmount: function(invoicenumber, details, callback) {
        client.request(
          utils.addParams(
            routes.invoices.refundOpenAmount,
            {invoice_number: invoicenumber}
          ),
          js2xmlparser('invoice', details),
          callback
        );
      },
      markSuccessful: function(invoicenumber, callback) {
        client.request(
          utils.addParams(
            routes.invoices.markSuccessful,
            { invoice_number: invoicenumber }
          ),
          callback
        );
      },
      markFailed: function(invoicenumber, callback) {
        client.request(
          utils.addParams(
            routes.invoices.markFailed,
            { invoice_number: invoicenumber }
          ),
          callback
        );
      },
      enterOfflinePayment: function(invoicenumber, details, callback) {
        client.request(
          utils.addParams(
            routes.invoices.enterOfflinePayment,
            { invoice_number: invoicenumber }
          ),
          js2xmlparser('transaction', details),
          callback
        );
      },
    }

    // https://dev.recurly.com/docs/list-plans
    this.plans = {
      list: function(filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addQueryParams(routes.plans.list, filter),
          callback
        );
      },
      get: function(plancode, callback) {
        client.request(
          utils.addParams(
            routes.plans.get,
            { plan_code: plancode }
          ),
          callback);
      },
      create: function(details, callback) {
        client.request(
          routes.plans.create,
          js2xmlparser('plan', details),
          callback
        );
      },
      update: function(plancode, details, callback) {
        client.request(
          utils.addParams(
            routes.plans.update,
            { plan_code: plancode }
          ),
          js2xmlparser('plan', details),
          callback
        );
      },
      remove: function(plancode, callback) {
        client.request(
          utils.addParams(
            routes.plans.remove,
            { plan_code: plancode }
          ),
          callback
        );
      }
    }

    // https://dev.recurly.com/docs/list-add-ons-for-a-plan
    this.planAddons = {
      list: function(plancode, filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addParams(
            utils.addQueryParams(routes.planAddons.list, filter),
            { plan_code: plancode }
          ),
          callback
        );
      },
      get: function(plancode, addoncode, callback) {
        client.request(
          utils.addParams(
            routes.planAddons.get,
            { plan_code: plancode, addon_code: addoncode }
          ),
          callback
        );
      },
      create: function(plancode, details, callback) {
        client.request(
          utils.addParams(
            routes.planAddons.create,
            { plan_code: plancode }
          ),
          js2xmlparser('add_on', details),
          callback
        );
      },
      update: function(plancode, addoncode, details, callback) {
        client.request(
          utils.addParams(
            routes.planAddons.update,
            { plan_code: plancode, add_on_code: addoncode }
          ),
          js2xmlparser('add_on', details),
          callback
        );
      },
      remove: function(plancode, addoncode, callback) {
        client.request(
          utils.addParams(
            routes.planAddons.remove,
            { plan_code: plancode, add_on_code: addoncode }
          ),
          callback
        );
      }
    }

    // https://dev.recurly.com/docs/list-subscriptions
    this.subscriptions = {
      list: function(filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addQueryParams(routes.subscriptions.list, filter),
          callback
        );
      },
      listByAccount: function(accountcode, filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addParams(
            utils.addQueryParams(routes.subscriptions.listByAccount, filter),
            { account_code: accountcode }
          ),
          callback
        );
      },
      get: function(uuid, callback) {
        client.request(
          utils.addParams(
            routes.subscriptions.get,
            { uuid: uuid }
          ),
          callback
        );
      },
      create: function(details, callback) {
        client.request(
          routes.subscriptions.create,
          js2xmlparser('subscription', details),
          callback
        );
      },
      preview: function(details, callback) {
        client.request(
          routes.subscriptions.preview,
          js2xmlparser('subscription', details),
          callback
        );
      },
      update: function(uuid, details, callback) {
        client.request(
          utils.addParams(
            routes.subscriptions.update,
            { uuid: uuid }
          ),
          js2xmlparser('subscription', details),
          callback
        );
      },
      updateNotes: function(uuid, details, callback) {
        client.request(
          utils.addParams(
            routes.subscriptions.updateNotes,
            { uuid: uuid }
          ),
          js2xmlparser('subscription', details),
          callback
        );
      },
      updatePreview: function(uuid, details, callback) {
        client.request(
          utils.addParams(
            routes.subscriptions.updatePreview,
            { uuid: uuid }
          ),
          js2xmlparser('subscription', details),
          callback
        );
      },
      cancel: function(uuid, callback) {
        client.request(
          utils.addParams(
            routes.subscriptions.cancel,
            { uuid: uuid }
          ),
          callback
        );
      },
      reactivate: function(uuid, callback) {
        client.request(
          utils.addParams(
            routes.subscriptions.reactivate,
            { uuid: uuid }
          ),
          callback
        );
      },
      terminate: function(uuid, refundType, callback) {
        client.request(
          utils.addParams(
            routes.subscriptions.terminate,
            { uuid: uuid, refund_type: refundType }
          ),
          callback
        );
      },
      postpone: function(uuid, nextRenewalDate, callback) {
        client.request(
          utils.addParams(
            routes.subscriptions.postpone,
            { uuid: uuid, next_renewal_date: nextRenewalDate }
          ),
          callback
        );
      }
    }

    // https://dev.recurly.com/docs/list-transactions
    this.transactions = {
      list: function(filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addQueryParams(routes.transactions.list, filter),
          callback
        );
      },
      listByAccount: function(accountCode, filter, callback) {
        if (typeof filter == 'function') {
          callback = filter;
          filter = null;
        }
        client.request(
          utils.addParams(
            utils.addQueryParams(routes.transactions.listByAccount, filter),
            { account_code: accountCode }
          ),
          callback
        );
      },
      get: function(id, callback) {
        client.request(
          utils.addParams(
            routes.transactions.get,
            { 'id': id }
          ),
          callback
        );
      },
      create: function(details, callback) {
        client.request(
          routes.transactions.create,
          js2xmlparser('transaction', details),
          callback
        );
      },
      refund: function(id, amount, callback) {
        if (typeof amount == 'function') {
          callback = amount;
          amount = null;
        }
        var route = utils.addParams(
          routes.transactions.refund,
          { 'id': id }
        );
        if (amount) {
          route = utils.addQueryParams(
            route,
            { amount_in_cents: amount }
          );
        }
        client.request(route, callback);
      }
    }
  }
})();
