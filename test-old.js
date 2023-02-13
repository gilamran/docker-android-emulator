const wd = require("wd");
const chai = require("chai");
const { assert } = chai;

const androidCaps = {
  platformName: "Android",
  automationName: "UiAutomator2",
  deviceName: "My Android Device",
  app: undefined, // Will be added in tests
};

// figure out where the Appium server should be pointing to
const serverConfig = {
  host: process.env.APPIUM_HOST || "localhost",
  port: process.env.APPIUM_PORT || 4723,
};

const androidApiDemos = "/appium-demo-app-debug.apk";

const PACKAGE = "io.appium.android.apis";
const SEARCH_ACTIVITY = ".app.SearchInvoke";
const ALERT_DIALOG_ACTIVITY = ".app.AlertDialogSamples";

describe("Basic Android interactions", function () {
  let driver;
  let allPassed = true;

  before(async function () {
    // Connect to Appium server
    driver = await wd.promiseChainRemote(serverConfig);

    // merge all the capabilities
    const caps = {
      ...androidCaps,
      app: androidApiDemos,
      appActivity: SEARCH_ACTIVITY, // Android-specific capability. Can open a specific activity.
    };

    // Start the session, merging all the caps
    await driver.init(caps);
  });

  afterEach(function () {
    // keep track of whether all the tests have passed, since mocha does not do this
    allPassed = allPassed && this.currentTest.state === "passed";
  });

  after(async function () {
    await driver.quit();
  });

  it("should send keys to search box and then check the value", async function () {
    // Enter text in a search box
    const searchBoxElement = await driver.elementById("txt_query_prefill");
    await searchBoxElement.sendKeys("Hello world!");

    // Press on 'onSearchRequestedButton'
    const onSearchRequestedButton = await driver.elementById("btn_start_search");
    await onSearchRequestedButton.click();

    // Check that the text matches the search term
    const searchText = await driver.waitForElementById("android:id/search_src_text");
    const searchTextValue = await searchText.text();
    assert.equal(searchTextValue, "Hello world!");
  });

  it("should click a button that opens an alert and then dismisses it", async function () {
    // Open the 'Alert Dialog' activity of the android app
    await driver.startActivity({ appPackage: PACKAGE, appActivity: ALERT_DIALOG_ACTIVITY });

    // Click button that opens a dialog
    const openDialogButton = await driver.elementById("io.appium.android.apis:id/two_buttons");
    await openDialogButton.click();

    // Check that the dialog is there
    const alertElement = await driver.waitForElementById("android:id/alertTitle");
    const alertText = await alertElement.text();
    assert.equal(alertText, `Lorem ipsum dolor sit aie consectetur adipiscing\nPlloaso mako nuto siwuf cakso dodtos anr koop.`);
    const closeDialogButton = await driver.elementById("android:id/button1");

    // Close the dialog
    await closeDialogButton.click();
  });
});
