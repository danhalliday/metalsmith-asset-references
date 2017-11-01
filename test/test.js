const metalsmith = require("metalsmith")
const references = require("..")
const contenthash = require("metalsmith-contenthash")
const fingerprint = require("metalsmith-fingerprint")

const pattern = "**/*.{png,js,css}"

describe("metalsmith-asset-reference", function() {
  it("should replace asset references when using metalsmith-contenthash", function(done) {
    var app = metalsmith(__dirname)

    app
      .source("fixtures/source")
      .use(contenthash({ pattern }))
      .use(references())

      .read(function(error, files) {
        should.not.exist(error)

        app.run(files, function(error, files) {
            should.not.exist(error)

            var file = files["index.html"]
            file.should.exist

            var markup = file.contents.toString()
            var hashes = app.metadata()["hashes"]
            markup.should.contain(hashes["images/image.png"])
            markup.should.contain(hashes["scripts/script.js"])
            markup.should.contain(hashes["styles/style.css"])

            done()
        })
      })
  })

  it("should replace asset references when using metalsmith-fingerprint", function(done) {
    var app = metalsmith(__dirname)

    app
      .source("fixtures/source")
      .use(fingerprint({ pattern }))
      .use(references({ key: "fingerprint" }))

      .read(function(error, files) {
        should.not.exist(error)

        app.run(files, function(error, files) {
            should.not.exist(error)

            var file = files["index.html"]
            file.should.exist

            var markup = file.contents.toString()
            var fingerprints = app.metadata()["fingerprint"]
            markup.should.contain(fingerprints["images/image.png"])
            markup.should.contain(fingerprints["scripts/script.js"])
            markup.should.contain(fingerprints["styles/style.css"])

            done()
        })
      })
  })
})
