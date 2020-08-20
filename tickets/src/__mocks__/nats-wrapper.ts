export const natsWrapper = {
  // the base publisher expects to be given a client that has a "publish" function
  client: {
    // create mock function
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
