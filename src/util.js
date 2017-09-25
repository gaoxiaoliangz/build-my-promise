const { PENDING, RESOLVED, REJECTED, INTERNAL } = require('./constants')

function doAsync(fn) {
  setTimeout(fn)
}

exports.doAsync = doAsync

function isPromiseLike(promise) {
  // 2.3.3.1: promise 也可能是带有 then 的 function
  return promise && (promise instanceof Object || typeof promise === 'object') && ('then' in promise)
}

/**
 * @param {GPromise} promise 
 * @param {function} done
 */
function unwrap(value, done) {
  if (isPromiseLike(value)) {
    let isFullfilled = false
    try {
      const then = value.then
      if (typeof then === 'function') {
        then.call(value, data => {
          if (isPromiseLike(data)) {
            unwrap(data, done)
          } else {
            done(RESOLVED, data)
            isFullfilled = true
          }
        }, err => {
          done(REJECTED, err)
        })
      } else {
        done(RESOLVED, value)
      }
    } catch (err) {
      if (!isFullfilled) {
        done(REJECTED, err)
      }
    }
  } else {
    done(RESOLVED, value)
  }
}

exports.unwrap = unwrap
