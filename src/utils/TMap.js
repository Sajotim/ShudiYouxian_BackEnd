export function TMap() {
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(qq)
    }
    const key = 'TW6BZ-W4RK4-LCWUR-DZ6PC-WOYB7-C4FJE' // TJ3BZ-6LVCF-C25JP-JOA3O-EWZFJ-5FBMI  TW6BZ-W4RK4-LCWUR-DZ6PC-WOYB7-C4FJE
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://map.qq.com/api/js?v=2.exp&callback=init&key=${key}&libraries=drawing,geometry,autocomplete,convertor`
    script.onerror = reject
    document.head.appendChild(script)
  })
}
