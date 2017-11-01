const bufferReplace = require("buffer-replace")

module.exports = function(options) {
  const key = (options && options.key) || "hashes"

  function sortByLength(a, b) {
    return b.length - a.length
  }

  return (function(files, metalsmith, done) {
    const hashes = metalsmith.metadata()[key]
    if (!hashes) { done(); return }

    Object.keys(files).forEach(function(name) {
      const file = files[name]

      Object.keys(hashes).sort(sortByLength).forEach(function(hashKey) {
        file.contents = bufferReplace(file.contents, hashKey, hashes[hashKey])
      })
    })

    done()
  })
}
