const VWO = require('../../lib/VWO');
const CachingUtil = require('../../lib/utils/CachingUtil');
const ImpressionUtil = require('../../lib/utils/ImpressionUtil');
const logging = require('../../lib/logging');

const {
  settingsFile1,
  settingsFile2,
  settingsFile3,
  settingsFile4,
  settingsFile5,
  settingsFile6
} = require('../test-utils/data/settingsFiles');

const settings = require('../test-utils/data/settingsFileAndUsersExpectation');
const testUtil = require('../test-utils/TestUtil');
const users = testUtil.getUsers();
const mockFn = jest.fn();

const logger = logging.getLogger();

let vwoClientInstance;
let spyResetCache;
let spyImpressionEvent;
let spyEventQueue;
let userId;
let campaignTestKey;
let goalIdentifier;
let userProfileService = { save: mockFn, lookup: mockFn };

beforeEach(() => {
  logging.setLogHandler(mockFn);
  logging.setLogLevel(logging.LogLevelEnum.ERROR);

  userId = testUtil.getRandomUser();
  campaignTestKey = settingsFile1.campaigns[0].key;
  goalIdentifier = settingsFile1.campaigns[0].goals[0].identifier;

  vwoClientInstance = new VWO({
    settingsFile: settingsFile1,
    logger,
    userProfileService
  });

  spyResetCache = jest.spyOn(CachingUtil, 'resetCache');
  spyImpressionEvent = jest.spyOn(ImpressionUtil, 'buildEvent');
});

describe('Class VWO', () => {
  describe('constructor', () => {
    test('should set stuff on the object itself to be referenced later in code', () => {
      vwoClientInstance = new VWO({
        logger,
        userProfileService
      });
      expect(vwoClientInstance.logger).toBeDefined();
      expect(vwoClientInstance.userProfileService).toBeDefined();
    });

    test('should not process settingsFile if settingsFile is not provided or corrupted', () => {
      vwoClientInstance = new VWO({
        logger,
        userProfileService
      });
      expect(vwoClientInstance.projectConfigManager).toBeUndefined();
    });

    test('should process settingsFile if it is provided and is valid', () => {
      expect(vwoClientInstance.projectConfigManager).toBeDefined();
      expect(vwoClientInstance.eventQueue).toBeDefined();
      expect(spyResetCache).toHaveBeenCalled();

      spyResetCache.mockRestore();
    });
  });

  describe('method: activate', () => {
    test('should return null if no argument is passed', () => {
      expect(vwoClientInstance.activate()).toBe(null);
    });

    test('should return null if no campaignTestKey is passed', () => {
      expect(vwoClientInstance.activate('', userId)).toBe(null);
    });

    test('should return null if no userId is passed', () => {
      expect(vwoClientInstance.activate(campaignTestKey)).toBe(null);
    });

    test('should return null if campaignTestKey is not found in settingsFile', () => {
      expect(vwoClientInstance.activate('NO_SUCH_CAMPAIGN_KEY', userId)).toBe(null);
    });

    test('should test against a campaign settings: traffic:50 and split:50-50', () => {
      const campaignKey = settingsFile1.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile1,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const variationName = vwoClientInstance.activate(campaignKey, users[j]);

        expect(variationName).toBe(settings[campaignKey][i].variation);
        if (variationName) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
        }
      }
    });

    test('should test against a campaign settings: traffic:100 and split:50-50', () => {
      const campaignKey = settingsFile2.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile2,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const variationName = vwoClientInstance.activate(campaignKey, users[j]);

        expect(variationName).toBe(settings[campaignKey][i].variation);
        if (variationName) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
        }
      }
    });

    test('should test against a campaign settings: traffic:100 and split:20-80', () => {
      const campaignKey = settingsFile3.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile3,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const variationName = vwoClientInstance.activate(campaignKey, users[j]);

        expect(variationName).toBe(settings[campaignKey][i].variation);
        if (variationName) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
        }
      }
    });

    test('should test against a campaign settings: traffic:20 and split:10-90', () => {
      const campaignKey = settingsFile4.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile4,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const variationName = vwoClientInstance.activate(campaignKey, users[j]);

        expect(variationName).toBe(settings[campaignKey][i].variation);
        if (variationName) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
        }
      }
    });

    test('should test against a campaign settings: traffic:100 and split:0-100', () => {
      const campaignKey = settingsFile5.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile5,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const variationName = vwoClientInstance.activate(campaignKey, users[j]);

        expect(variationName).toBe(settings[campaignKey][i].variation);
        if (variationName) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
        }
      }
    });

    test('should test against a campaign settings: traffic:100 and split:33.3333:33.3333:33.3333', () => {
      const campaignKey = settingsFile6.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile6,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const variationName = vwoClientInstance.activate(campaignKey, users[j]);

        expect(variationName).toBe(settings[campaignKey][i].variation);
        if (variationName) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
        }
      }
    });
  });

  describe('method: getVariation', () => {
    test('should return null if no argument is passed', () => {
      expect(vwoClientInstance.getVariation()).toBe(null);
    });

    test('should return null if no campaignTestKey is passed', () => {
      expect(vwoClientInstance.getVariation('', userId)).toBe(null);
    });

    test('should return null if no userId is passed', () => {
      expect(vwoClientInstance.getVariation(campaignTestKey)).toBe(null);
    });

    test('should return null if campaignTestKey is not found in settingsFile', () => {
      expect(vwoClientInstance.getVariation('NO_SUCH_CAMPAIGN_KEY', userId)).toBe(null);
    });

    test('should test against a campaign settings: traffic:50 and split:50-50', () => {
      const campaignKey = settingsFile1.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile1,
        logger,
        userProfileService
      });

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        expect(vwoClientInstance.getVariation(campaignKey, users[j])).toBe(settings[campaignKey][i].variation);
      }
    });

    test('should test against a campaign settings: traffic:100 and split:50-50', () => {
      const campaignKey = settingsFile2.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile2,
        logger,
        userProfileService
      });

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        expect(vwoClientInstance.getVariation(campaignKey, users[j])).toBe(settings[campaignKey][i].variation);
      }
    });

    test('should test against a campaign settings: traffic:100 and split:20-80', () => {
      const campaignKey = settingsFile3.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile3,
        logger,
        userProfileService
      });

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        expect(vwoClientInstance.getVariation(campaignKey, users[j])).toBe(settings[campaignKey][i].variation);
      }
    });

    test('should test against a campaign settings: traffic:20 and split:10-90', () => {
      const campaignKey = settingsFile4.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile4,
        logger,
        userProfileService
      });

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        expect(vwoClientInstance.getVariation(campaignKey, users[j])).toBe(settings[campaignKey][i].variation);
      }
    });

    test('should test against a campaign settings: traffic:100 and split:0-100', () => {
      const campaignKey = settingsFile5.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile5,
        logger,
        userProfileService
      });

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        expect(vwoClientInstance.getVariation(campaignKey, users[j])).toBe(settings[campaignKey][i].variation);
      }
    });

    test('should test against a campaign settings: traffic:100 and split:33.3333:33.3333:33.3333', () => {
      const campaignKey = settingsFile6.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile6,
        logger,
        userProfileService
      });

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        expect(vwoClientInstance.getVariation(campaignKey, users[j])).toBe(settings[campaignKey][i].variation);
      }
    });
  });

  describe('method: track', () => {
    test('should return null if no argument is passed', () => {
      expect(vwoClientInstance.track()).toBe(false);
    });

    test('should return false if no campaignTestKey is passed', () => {
      expect(vwoClientInstance.track('', userId)).toBe(false);
    });

    test('should return false if no userId is passed', () => {
      expect(vwoClientInstance.track(campaignTestKey)).toBe(false);
    });

    test('should return false if no goalIdentifier is passed', () => {
      expect(vwoClientInstance.track(campaignTestKey, userId)).toBe(false);
    });

    test('should return false if campaignTestKey is not found in settingsFile', () => {
      expect(vwoClientInstance.track('NO_SUCH_CAMPAIGN_KEY', userId, goalIdentifier)).toBe(false);
    });

    test('should return false if goalIdentifier is not found in settingsFile', () => {
      expect(vwoClientInstance.track(campaignTestKey, userId, 'NO_SUCH_GOAL_IDENTIFIER')).toBe(false);
    });

    test('should test against a campaign settings: traffic:50 and split:50-50', () => {
      const campaignKey = settingsFile1.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile1,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const isTracked = vwoClientInstance.track(campaignKey, users[j], goalIdentifier);

        if (isTracked) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
          expect(isTracked).toBe(true);
        } else {
          expect(isTracked).toBe(false);
        }
      }
    });

    test('should test against a campaign settings: traffic:100 and split:50-50', () => {
      const campaignKey = settingsFile2.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile2,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const isTracked = vwoClientInstance.track(campaignKey, users[j], goalIdentifier);

        if (isTracked) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
          expect(isTracked).toBe(true);
        } else {
          expect(isTracked).toBe(false);
        }
      }
    });

    test('should test against a campaign settings: traffic:100 and split:20-80', () => {
      const campaignKey = settingsFile3.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile3,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const isTracked = vwoClientInstance.track(campaignKey, users[j], goalIdentifier);

        if (isTracked) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
          expect(isTracked).toBe(true);
        } else {
          expect(isTracked).toBe(false);
        }
      }
    });

    test('should test against a campaign settings: traffic:20 and split:10-90', () => {
      const campaignKey = settingsFile4.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile4,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const isTracked = vwoClientInstance.track(campaignKey, users[j], goalIdentifier);

        if (isTracked) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
          expect(isTracked).toBe(true);
        } else {
          expect(isTracked).toBe(false);
        }
      }
    });

    test('should test against a campaign settings: traffic:100 and split:0-100', () => {
      const campaignKey = settingsFile5.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile5,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const isTracked = vwoClientInstance.track(campaignKey, users[j], goalIdentifier);

        if (isTracked) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
          expect(isTracked).toBe(true);
        } else {
          expect(isTracked).toBe(false);
        }
      }
    });

    test('should test against a campaign settings: traffic:100 and split:33.3333:33.3333:33.3333', () => {
      const campaignKey = settingsFile6.campaigns[0].key;

      vwoClientInstance = new VWO({
        settingsFile: settingsFile6,
        logger,
        userProfileService
      });

      spyEventQueue = jest.spyOn(vwoClientInstance.eventQueue, 'process');

      for (let i = 0, j = 0; i < settings[campaignKey].length, j < users.length; i++, j++) {
        const isTracked = vwoClientInstance.track(campaignKey, users[j], goalIdentifier);

        if (isTracked) {
          expect(spyImpressionEvent).toHaveBeenCalled();
          expect(spyEventQueue).toHaveBeenCalled();
          expect(isTracked).toBe(true);
        } else {
          expect(isTracked).toBe(false);
        }
      }
    });
  });
});
