
/* ----------- Each shop may has a specific config and method3 -------------- */

var _YEKTANET_CONFIG = {
    delay: 1000, /* delay in milliseconds */
    retry: 3, /* count of tries for getting product, between each try use {delay} multiple by {retry} value [Max 10 seconds] */
    method1: true, /* method1 => Use google application/ld+json */
    method2: true, /* method2 => Use google schema scopes */
    method3: true,  /* method3 => Use html elements */
    required: ['sku', 'title', 'image', 'price'] /* required properties */
}

var _YEKTANET_METHOD3 = {
    sku: function () {
        console.log('Im Here3')
    },
    title: function () {

    },
    image: function () {

    },
    price: function () {

    },
    discount: function () {

    },
    isAvailable: function () {

    },
    expiration: function () {

    },
    category: function () {
        console.log('method 3 > category function')
    },
    brand: function () {

    },
    averageVote: function () {

    },
    totalVotes: function () {

    }
}
