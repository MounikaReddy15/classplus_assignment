// Login Functionality
const assert = require("assert");

/**
 * Requirements:
 *
 * If a user enters three wrong passwords consecutively 3 times, then BLOCK the USER. Reset in 1 hour
 * If a user enters three wrong passwords within a sliding  time frame of 30 mins, BLOCK the USER.
 *
 * */

const SLIDING_WINDOW_MINS = 30;

class LoginResponeEnum {
  static get SUCCESS() {
    return "SUCCESS";
  }

  static get FAIL() {
    return "FAIL";
  }

  static get BLOCKED() {
    return "BLOCKED";
  }

  static get values() {
    return [this.SUCCESS, this.FAIL, this.BLOCKED];
  }
}

class LoginSimulation {
  constructor() {
    // init some stuff
    this.bootstrapUsers();
  }

  bootstrapUsers() {
    // create some users in memory database simulation
    return {
      _id: "5ecb14f0b8160e30080f0c25",
      user: "xyz",
      pass: "!23",
    };
  }

  doLogin(username, password, date = new Date()) {
    var count = 1;
    // time at the begining
    var timeCount = date;
    // to get the user data
    var userdata = this.bootstrapUsers();

    // if the user enters wrong password or username
    if (username != userdata.user || password != userdata.pass) {
      count++;
      return LoginResponeEnum.FAIL; // return a state
    }

    //wrong data for  consecutively 3 times
    if (
      count == 3 &&
      timeCount - date <= this.inMins(5) &&
      password != userdata.pass
    ) {
      count = 0;
      return LoginResponeEnum.BLOCKED;
    }

    // unblock after 60mins
    if (LoginResponeEnum.BLOCKED && timeCount - date == this.inMins(60)) {
      return LoginResponeEnum.values;
    }

    // three wrong passwords in 30mins
    if (password != userdata.pass && timeCount - date == this.inMins(30)) {
      return LoginResponeEnum.BLOCKED;
    }

    return LoginResponeEnum.SUCCESS;
  }

  inMins(mins) {
    return new Date(+new Date() + mins * 60 * 1000);
  }

  // for testing
  testThreeConsiquitiveFailures() {
    console.log("Testing Three Consequitive wrong passwords");
    assert.equal(this.doLogin("user 1", "wrong pass"), LoginResponeEnum.FAIL);
    assert.equal(
      this.doLogin("user 1", "wrong pass", this.inMins(20)),
      LoginResponeEnum.FAIL
    );
    assert.equal(
      this.doLogin("user 1", "wrong pass", this.inMins(25)),
      LoginResponeEnum.BLOCKED
    );
    assert.equal(
      this.doLogin("user 1", "wrong pass", this.inMins(40)),
      LoginResponeEnum.BLOCKED
    );
    assert.equal(
      this.doLogin("user 1", "wrong pass", this.inMins(60)),
      LoginResponeEnum.BLOCKED
    );
    assert.equal(
      this.doLogin("user 1", "right pass", this.inMins(60)),
      LoginResponeEnum.BLOCKED
    );
    assert.equal(
      this.doLogin("user 1", "wrong pass", this.inMins(150)),
      LoginResponeEnum.FAIL
    );
  }

  testUserIsBlockedInSlidingTimeFrame() {
    console.log("Testing user is blocked in sliding timeframe");
    assert.equal(this.doLogin("user 1", "wrong pass"), LoginResponeEnum.FAIL);
    assert.equal(
      this.doLogin("user 1", "right pass", this.inMins(5)),
      LoginResponeEnum.SUCCESS
    );
    assert.equal(
      this.doLogin("user 1", "right pass", this.inMins(8)),
      LoginResponeEnum.SUCCESS
    );
    assert.equal(
      this.doLogin("user 1", "wrong pass", this.inMins(20)),
      LoginResponeEnum.FAIL
    );
    assert.equal(
      this.doLogin("user 1", "wrong pass", this.inMins(31)),
      LoginResponeEnum.FAIL
    );
    assert.equal(
      this.doLogin("user 1", "right pass", this.inMins(40)),
      LoginResponeEnum.SUCCESS
    );
    assert.equal(
      this.doLogin("user 1", "wrong pass", this.inMins(44)),
      LoginResponeEnum.BLOCKED
    );
    assert.equal(
      this.doLogin("user 1", "right pass", this.inMins(45)),
      LoginResponeEnum.BLOCKED
    );
    assert.equal(
      this.doLogin("user 1", "right pass", this.inMins(110)),
      LoginResponeEnum.SUCCESS
    );
  }
}

// Test condition 1
new LoginSimulation().testThreeConsiquitiveFailures();
// test condition 2
new LoginSimulation().testUserIsBlockedInSlidingTimeFrame();
