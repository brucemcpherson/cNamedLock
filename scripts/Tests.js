function namedLockTestRunner() {
  
  /**
  *
  * GasT - Google Apps Script Testing-framework
  *
  * GasT is a TAP-compatable testing framework for Google Apps Script (GAS). 
  * It provides an easy way to verify whether GAS programs you write is behaving as expected or not.
  * 
  * Github: https://github.com/zixia/gast
  *
  */
  if ((typeof GasTap)==='undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gast/master/src/gas-tap-lib.js').getContentText())
  } // Class GasTap is ready for use now!
  
  var test = new GasTap()  
  
  test('NamedLock', function (t) {
    var namedLock = new NamedLock().setKey('a', 1,{x:'a',y:'b'}).setSameInstanceLocked(true);
    
    // unlock from previous attempt
    namedLock.unlock();
    t.ok(!namedLock.isLocked(), 'after unlock, isLocked should be false');
    
    // take a lock
    namedLock.lock();
    t.ok(namedLock.isLocked(), 'after lock, isLocked should be true')
    
    //unlock
    namedLock.unlock();
    t.ok(!namedLock.isLocked(), 'after unlock again, isLocked should be false');
    
    //try some other key
    namedLock.setKey('something else');
    // unlick from previous attempt
    namedLock.unlock();
    t.ok(!namedLock.isLocked(), 'try some other key, isLocked should be false');
    
    // try with a small timeout
    var shortLock = new NamedLock(500).setKey('blub').setSameInstanceLocked(true);
    shortLock.lock()
    t.ok(shortLock.isLocked(), 'isLocked(500) should be true');    
    
    // sleep and then check again
    Utilities.sleep(600);
    t.ok(!shortLock.isLocked(), 'timeout, isLocked should be false')
    
    // try again
    shortLock.lock("test function")
    shortLock.setSameInstanceLocked(true);
    t.ok(shortLock.isLocked(), 'try again, should be true')
    
    var PROTECTED_FUNCTION_RAN = false
    var p = new NamedLock().setKey("some shared resource").protect ("me", function () {
      PROTECTED_FUNCTION_RAN = true
      return 'this function ran';
    });
    t.ok(PROTECTED_FUNCTION_RAN, 'protected function ran')
  })  


  /////////////////////////////////////////////////////////////////

  
  return test.finish()
  
  
}
