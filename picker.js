
/* ---------------------------- version 0.1  ------------------------------ */

document.addEventListener("DOMContentLoaded", function () {

    var config  = _YEKTANET_CONFIG
    var method3 = _YEKTANET_METHOD3

    /* different methods to get product properties */
    var picker = {
        method3: method3,
        method1: {
            sku: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('sku'))
                    return ''
                var sku = productsInGoogleJsonFormat.sku
                return getter.sku(sku)
            },
            title: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('name'))
                    return ''
                var title = productsInGoogleJsonFormat.name
                return getter.title(title)
            },
            image: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('image'))
                    return ''
                var image = productsInGoogleJsonFormat.image
                if (Array.isArray(image) && image[0])
                    image = image[0]

                if(typeof image === "object" && image.url)
                    image = image.url

                return getter.image(image)
            },
            price: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('offers') && !productsInGoogleJsonFormat.offers.hasOwnProperty('price'))
                    return ''
                /* Im not sure about this one > only for testing reason */
                if (Array.isArray(productsInGoogleJsonFormat.offers) && productsInGoogleJsonFormat.offers[0])
                    productsInGoogleJsonFormat.offers = productsInGoogleJsonFormat.offers[0]
                var price = productsInGoogleJsonFormat.offers.price
                var currency = productsInGoogleJsonFormat.offers.priceCurrency
                return getter.price(price, currency)
            },
            discount: function () {
                /* todo */
                if (!productsInGoogleJsonFormat.hasOwnProperty('title'))
                    return ''
                var title = productsInGoogleJsonFormat.title
                return getter.sku(title)
            },
            isAvailable: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('offers') || !productsInGoogleJsonFormat.offers.hasOwnProperty('availability'))
                    return ''
                var availability = productsInGoogleJsonFormat.offers.availability
                return getter.isAvailable(availability)
            },
            expiration: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('offers') || !productsInGoogleJsonFormat.offers.hasOwnProperty('priceValidUntil'))
                    return ''
                var expiration = productsInGoogleJsonFormat.offers.priceValidUntil
                return getter.expiration(expiration)
            },
            category: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('title'))
                    return ''
                var title = productsInGoogleJsonFormat.title
                return getter.sku(title)
            },
            brand: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('brand') || !productsInGoogleJsonFormat.brand.hasOwnProperty('name'))
                    return ''
                var brand = productsInGoogleJsonFormat.brand.name
                return getter.sku(brand)
            },
            totalVotes: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('aggregateRating') || !productsInGoogleJsonFormat.aggregateRating.hasOwnProperty('reviewCount'))
                    return ''
                var count = productsInGoogleJsonFormat.aggregateRating.reviewCount
                return getter.totalVotes(count)
            },
            averageVote: function () {
                if (!productsInGoogleJsonFormat.hasOwnProperty('aggregateRating') || !productsInGoogleJsonFormat.aggregateRating.hasOwnProperty('ratingValue'))
                    return ''
                var rate = productsInGoogleJsonFormat.aggregateRating.ratingValue
                return getter.averageVote(product.totalVotes, rate)
            }
        },
        method2: {
            sku: function () {
                var element = productsInGoogleScopeFormat.querySelector('[itemprop="sku"]')
                if (!element)
                    return ''
                element = element.getAttribute('content');
                return getter.sku(element)
            },
            title: function () {
                var element = productsInGoogleScopeFormat.querySelector('[itemprop="name"]')
                if (!element)
                    return ''
                element = element.innerHTML
                return getter.title(element)
            },
            image: function () {
                var element = productsInGoogleScopeFormat.querySelector('[itemprop="image"]')
                if (!element)
                    return ''
                element = element.getAttribute('src');
                return getter.image(element)
            },
            price: function () {
                var element = productsInGoogleScopeFormat.querySelector('[itemprop="price"]')
                if (!element)
                    return ''
                element = element.getAttribute('content');
                return getter.price(element)
            },
            discount: function () {
                /* todo */
            },
            isAvailable: function () {
                var element = productsInGoogleScopeFormat.querySelector('[itemprop="availability"]')
                if (!element)
                    return ''
                element = element.getAttribute('href');
                return getter.isAvailable(element)
            },
            expiration: function () {
                /* todo */
            },
            category: function () {
                /* todo */
            },
            brand: function () {
                var element = productsInGoogleScopeFormat.querySelector('[itemprop="brand"]')
                if (!element)
                    return ''
                element = element.getAttribute('content');
                return getter.brand(element)
            },
            averageVote: function () {
                /* todo */
            },
            totalVotes: function () {
                /* todo */
            }
        }
    }
    var tried = 1
    var url = window.location.host
    var product = {
        sku: '',
        title: '',
        image: '',
        price: '',
        discount: 0,
        isAvailable: false,
        expiration: '',
        category: [],
        brand: '',
        totalVotes: 0,
        averageVote: 0.0
    }

    /* Get method 1 json data */
    try {
        if (config.method1) {
            /* todo can be several */
            var productsInGoogleJsonFormat = document.querySelectorAll('script[type="application/ld+json"]');
            if (productsInGoogleJsonFormat.length) {
                productsInGoogleJsonFormat.forEach(function (item) {
                    item = JSON.parse(item.innerText)
                    if (item['@type'] && item['@type'].toLowerCase() == 'product') {
                        productsInGoogleJsonFormat = item
                    }
                })
                if (!productsInGoogleJsonFormat.sku) {
                    config.method1 = false
                }
            } else {
                config.method1 = false
            }
            console.log(productsInGoogleJsonFormat)
        }
    } catch (e) {
        /* Test Purpose */
        console.warn(e)
        config.method1 = false
    }

    /* Get method 2 raw data */
    try {
        if (config.method2) {
            var scope = document.querySelectorAll('[itemtype="https://schema.org/Product"]')
            if (!scope[0])
                scope = document.querySelectorAll('[itemtype="http://schema.org/Product"]')
            if (scope[0]) {
                var productsInGoogleScopeFormat = scope[0];
            } else {
                throw 'There is no scope!'
            }
        }
    } catch (e) {
        /* Test Purpose */
        console.warn(e)
        config.method2 = false
    }

    /* Fit data to our format */
    var getter = {
        sku: function (val) {
            if (!val)
                return ''
            val = val.toString().trim()
            return val
        },
        title: function (val) {
            if (!val)
                return ''
            val = val.toString().trim()
            return val
        },
        image: function (val) {
            if (!val)
                return ''
            val = val.toString().trim()
            return val
        },
        price: function (val, currency) {
            /*
                priceCurrency must be a iso 4217 three characters
                    => IRT does not supported by standard, but some shops used that !!!
            */
            currency = currency ? currency.toLowerCase().trim() : ''
            val = parseInt(val)
            if (!isNumeric(val))
                return 0
            if (currency == 'irt' || currency == 'toman') { /* IRT !!! */
                /* We don't need to change the price */
            } else {
                /* todo > Some websites send Toman price with IRR flag! Like "hamsaranmarket.com" */
                val = val / 10 /* Rial To Toman */
            }
            return val
        },
        discount: function (val) {
            // discount > float
            if (!val)
                return ''
        },
        isAvailable: function (val) {
            var trueContitions = ['https://schema.org/InStock', 'https://schema.org/InStock', true, 'true', 'instock', 'InStock']
            if (trueContitions.includes(val))
                return true
            return false
        },
        expiration: function (val, from) {
            /* todo > im not sure about the response check it later ASAP */
            if (!val)
                return ''
            var date = ''
            from = from ? from : ''
            if (from == 'mm/dd/yyyy') {
                var m = val.slice(0, 2)
                var d = val.slice(3, 5)
                var y = val.slice(6, 10)
                date = new Date(Date.UTC(y, m, d,'23','59','59')).getTime();
                date = date / 1000
            } else {
                /* Convert all correct 8901 format date */
                date = Date.parse(val) / 1000;
            }
            return date
        },
        category: function (val) {
            if (!val)
                return []
        },
        brand: function (val) {
            if (!val)
                return ''
            val = val.toString().trim()
            return val
        },
        totalVotes: function (count) {
            count = parseInt(count)
            if (!count)
                return ''
            return count
        },
        averageVote: function (count, rate, min, max) {
            /*if (count <= 0)
                return 0*/
            rate = parseFloat(rate)
            min = min ? parseInt(min) : 0
            max = max ? parseInt(max) : 5
            if (!rate)
                return ''
            if (rate > max || rate < min)
                return ''
            return rate
        }
    }

    /* Validate all methods */
    var validate = {
        sku: function (val) {
           if (len(val) === 0)
               return false
           return true
        },
        title: function (val) {
            if (len(val) === 0)
                return false
            return true
        },
        image: function (val) {
            /* todo > include web site url */
            return isValidUrl(val)
        },
        price: function (val) {
            if (len(val) === 0)
                return false
            if (!isNumeric(val))
                return false
            return true
        },
        discount: function (val) {
            if (len(val) === 0)
                return false
            if (!isNumeric(val))
                return false
            return true
        },
        isAvailable: function (val) {
            return isBoolean(val)
        },
        expiration: function (val) {
            if (!isNumeric(val))
                return false
            if (len(val) == 13 || len(val) == 10)
                return true
            return false
        },
        category: function (val) {
            if (!Array.isArray(val))
                return false
            return true
        },
        brand: function (val) {
            if (len(val) === 0)
                return false
            return true
        },
        averageVote: function (val) {
            if (len(val) === 0)
                return false
            if (!isNumeric(val))
                return false
            return true
        },
        totalVotes: function (val) {
            if (len(val) === 0)
                return false
            if (!isNumeric(val))
                return false
            return true
        }
    }

    /* Main function in order to get product properties */
    try {
        setTimeout(function () {
            /* Test Purpose */
            console.warn('Process is started')
            var methodIndex
            var prop
            for (prop in picker.method1) {
                methodIndex = 1
                for (methodIndex; methodIndex <= 3; methodIndex++) { /* We have 3 methods */
                    // methods order > 1 -> 2 -> 3
                    if (config['method' + (methodIndex).toString()]) {
                        if (picker['method' + (methodIndex).toString()].hasOwnProperty(prop)) { /* Sometimes we dont have a function for specific method */
                            product[prop] = picker['method' + (methodIndex).toString()][prop]()
                            if (validate[prop](product[prop])) { /* Validate Value */
                                break; /* So we have the correct value and dont check other methods */
                            } else {
                                if (methodIndex === 3 && (config.required.includes(prop))) {
                                    /* We have to stop progress, because a required value doesn't exist or didnt pass validate */
                                    throw prop + ' value doesn\'t exist'
                                }
                            }
                        } else {
                            /* Method doesn't have properties */
                        }
                    } else {
                        /* Method is disable */
                    }
                }
            }
            /* Test Purpose */
            console.warn('Process done')
            /* some API for sending product to Yektanet */
            console.log(product)
        }, config.delay)
    } catch (e) {
        /* We can use a online js debugger like "bugsnag",... */
        console.error(e)
    }

    function len (val) {
        if (!val)
            return 0
        val = val.toString()
        return val.length
    }

    function isValidUrl(val) {
        if (!val)
            return false
        var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
        var regex = new RegExp(expression)
        var res = regex.test(val)
        return res
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function isBoolean (val) {
        if (typeof val === "boolean"){
            return true
        }
        return false
    }

})
