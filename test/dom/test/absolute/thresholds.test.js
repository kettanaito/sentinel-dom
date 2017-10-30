/**
 * Thresholds
 */
describe('Thresholds (absolute)', () => {
  afterEach(cleanUp);

  /**
   * Horizontal threshold
   */
  describe('thresholdX', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
        targets: targetSelector,
        snapshots: [
          {
            thresholdX: 25,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollX < thresholdX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.20, 0);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX > thresholdX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.85, 0);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdX is visible (LTR)', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.35, 0);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdX is visible (RLT)', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.25, 0);
      expect(times).to.equal(1);
    });
  });

  /**
   * Horizontal threshold + offsetX
   */
  describe('thresholdX + offsetX (positive)', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          thresholdX: 25,
          offsetX: 10,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollX < thresholdX + offsetX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.25, 0);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX > thresholdX + offsetX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.75, 0);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdX + offsetX is visible (LTR)', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.25 + 20, 0);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdX + offsetX is visible (RTL)', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.75 - 15, 0);
      expect(times).to.equal(1);
    });
  });

  /**
   * Horizontal threshold + offsetX
   */
  describe('thresholdX + offsetX (negative)', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          thresholdX: 25,
          offsetX: -10,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollX < thresholdX + offsetX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.25 - 10 , 0);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX > thresholdX + offsetX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.75 + 15, 0);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdX + offsetX is visible (LTR)', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.25, 0);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdX + offsetX is visible (RTL)', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.75, 0);
      expect(times).to.equal(1);
    });
  });

  /**
   * Vertical threshold
   */
  describe('thresholdY', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          thresholdY: 25,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollY < thresholdY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, targetSize * 0.15);
      expect(times).to.equal(0);
    });

    it('should reject: scrollY > thresholdY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.8);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdY is visible (TTB)', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, targetSize * 0.35);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdY is visible (BTT)', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.5);
      expect(times).to.equal(1);
    });
  });

  /**
   * Vertical thresholds + offsetY (positive)
   */
  describe('thresholdY + offsetY (positive)', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          thresholdY: 25,
          offsetY: 10,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollY < thresholdY + offsetY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, targetSize * 0.25);
      expect(times).to.equal(0);
    });

    it('should reject: scrollY > thresholdY + offsetY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdY + offsetY is visible (TTB)', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, targetSize * 0.25 + 20);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdY + offsetY is visible (BTT)', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75 - 15);
      expect(times).to.equal(1);
    });
  });

  /**
   * Vertical thresholds + offsetY (negative)
   */
  describe('thresholdY + offsetY (negative)', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          thresholdY: 25,
          offsetY: -10,
          callback({ DOMElement}) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollY < thresholdY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, targetSize * 0.25 - 10);
      expect(times).to.equal(0);
    });

    it('should reject: scrollY > thresholdY + offsetY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75 + 10);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdY + offsetY is visible (TTB)', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, targetSize * 0.25);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdY + offsetY is visible (BTT)', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75);
      expect(times).to.equal(1);
    });
  });

  /**
   * Horizontal and Vertical thresholds
   */
  describe('thresholdX + thresholdY', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          thresholdX: 25,
          thresholdY: 25,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollX/Y < thresholdX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.15, targetSize * 0.15);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX/Y > thresholdX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.9, innerHeight + targetSize * 0.9);
      expect(times).to.equal(0);
    });

    it('should reject: scroll within thresholdX only', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.5, 0);
      expect(times).to.equal(0);
    });

    it('should reject: scroll within thresholdY only', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(0, targetSize * 0.5);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdX/Y are visible (TTB & LTR)', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.5, targetSize * 0.5);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdX/Y are visible (BTT & RTL)', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.5, innerHeight + targetSize * 0.5);
      expect(times).to.equal(1);
    });
  });

  /**
   * Horizontal and Vertical thresholds + offsetX/Y (positive)
   */
  describe('thresholdX/Y + offsetX/Y (positive)', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          thresholdX: 25,
          thresholdY: 25,
          offsetX: 10,
          offsetY: 10,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollX/Y < thresholdX/Y + offsetX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.25, targetSize * 0.25);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX/Y > thresholdX/Y + offsetX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.75, innerHeight + targetSize * 0.75);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdX/Y + offsetX/Y are visible (TTB & LTR)', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.25 + 20, targetSize * 0.25 + 20);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdX/Y + offsetX/Y are visible (BTT & RTL)', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.25 + 20, innerHeight + targetSize * 0.25 + 20);
      expect(times).to.equal(1);
    });
  });

  /**
   * Horizontal and Vertical thresholds + offsetX/Y (negative)
   */
  describe('thresholdX/Y + offsetX/Y (negative)', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          thresholdX: 25,
          thresholdY: 25,
          offsetX: -10,
          offsetY: -10,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollX/Y < thresholdX/Y + offsetX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.25 - 15, targetSize * 0.25 - 15);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX/Y > thresholdX/Y + offsetX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.75 + 15, innerHeight + targetSize * 0.75 + 15);
      expect(times).to.equal(0);
    });

    it('should resolve: thresholdX/Y + offsetX/Y are visible (TTB & LTR)', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.25 + 15, targetSize * 0.25 + 15);
      expect(times).to.equal(1);
    });

    it('should resolve: thresholdX/Y + offsetX/Y are visible (BTT & RTL)', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.25 + 15, innerHeight + targetSize * 0.25 + 15);
      expect(times).to.equal(1);
    });
  });
});
