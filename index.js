const got = require('got');
const parseLink = require('parse-link-header');

module.exports = function(url, series, opts) {

    return new Promise((resolve, reject) => {
        let index = 0;

        const output = [];

        function gotMilk(url) {

            got(url, {
                json: true
                ...opts
            }).then(res => {
                const link = parseLink(res.headers.link);

                res.index = ++index;

                output.push(series ? series(res) : res);

                (link && link.next) ?
                    gotMilk(link.next.url) :
                    ((index = 0), resolve(Promise.all(output)));

            }).catch(err => {
                reject(err);
            });
        }

        gotMilk(url);
    });
};
