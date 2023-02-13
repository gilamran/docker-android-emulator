const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
describe("My Demo test suite", () => {
  it("should write hello world", async () => {
    const searchBoxElement = await $("#txt_query_prefill");
    console.log(searchBoxElement, "^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    await searchBoxElement.addValue("Hello world!");
    await sleep(3000);
  });
});
