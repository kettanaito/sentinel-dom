/**
 * Edges (Bleeding edges)
 */
describe('Edges (absolute)', () => {
  afterEach(cleanUp);

  /**
   * Horizontal edge
   */
  describe('edgeX', () => {
    let times = 0;

    before(() => addObserver(window.observer = new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeX: 50,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollX < edgeX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(50, 0);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX > edgeX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.75, 0);
      expect(times).to.equal(0);
    });

    it('should resolve: edgeX is visible', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(targetSize * 0.6, 0);
      expect(times).to.equal(1);
    });
  });

  /**
   * Horizontal edge + offsetX (positive)
   */
  describe('edgeX + offsetX (positive)', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeX: 35,
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

    it('should reject: scrollX < edgeX + offsetX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(15, 0);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX > edgeX + offsetX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.35 + 20, 0); // TODO 15 should pass as well
      expect(times).to.equal(0);
    });

    it('should resolve: edgeX + offsetX is visible', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.35 + 10, 0);
      expect(times).to.equal(1);
    });
  });

  /**
   * Horizontal edge + offsetX (negative)
   */
  describe('edgeX + offsetX (negative)', () => {
    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeX: 35,
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

    it('should reject: scrollX < edgeX + offsetX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(15, 0);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX > edgeX + offsetX', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.35 + 15, 0);
      expect(times).to.equal(0);
    });

    it('should resolve: edgeX + offsetX is visible', async () => {
      createTarget({ marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.35 - 15, 0);
      expect(times).to.equal(1);
    });
  });

  /**
   * Vertical edge
   */
  describe('edgeY', () => {
    // let times = 0;

    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeY: 50,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollY < edgeY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, 50);
      expect(times).to.equal(0);
    });

    it('should reject: scrollY > edgeY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75);
      expect(times).to.equal(0);
    });

    it('should resolve: edgeY is visible', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight);
      expect(times).to.equal(1);
    });
  });

  /**
   * Vertical edge + offsetY (positive)
   */
  describe('edgeY + offsetY (positive)', () => {
    // let times = 0;

    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeY: 75,
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

    it('should reject: scrollY < edgeY + offsetY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, 50);
      expect(times).to.equal(0);
    });

    it('should reject: scrollY > edgeY + offsetY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75 + 15);
      expect(times).to.equal(0);
    });

    it('should resolve: edgeY + offsetY is visible', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75 + 5);
      expect(times).to.equal(1);
    });
  });

  /**
   * Vertical edge + offsetY (negative)
   */
  describe('edgeY + offsetY (negative)', () => {
    // let times = 0;

    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeY: 75,
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

    it('should reject: scrollY < edgeY + offsetY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, 50);
      expect(times).to.equal(0);
    });

    it('should reject: scrollY > edgeY + offsetY', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75 + 15);
      expect(times).to.equal(0);
    });

    it('should resolve: edgeY + offsetY is visible', async () => {
      createTarget({ marginTop: `${innerHeight}px` });

      await scroll(0, innerHeight + targetSize * 0.75 - 15);
      expect(times).to.equal(1);
    });
  });

  /**
   * Horizontal + vertical edges
   */
  describe('edgeX + edgeY', () => {
    // let times = 0;

    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeX: 25,
          edgeY: 50,
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    })));
    after(flushObserver);
    afterEach(() => times = 0);

    it('should reject: scrollX/Y < edgeX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(50, 50);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX/Y > edgeX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.5, innerHeight + targetSize * 0.75);
      expect(times).to.equal(0);
    });

    it('should resolve: edgeX/Y are visible', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.15, innerHeight + targetSize * 0.35);
      expect(times).to.equal(1);
    });
  });

  /**
   * edgeX/Y + offsetX/Y (positive)
   */
  describe('edgeX/Y + offsetX/Y (positive)', () => {
    // let times = 0;

    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeX: 25,
          edgeY: 50,
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

    it('should reject: scrollX/Y < edgeX/Y + offsetX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(50, 50);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX/Y > edgeX/Y + offsetX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.25 + 15, innerHeight + targetSize * 0.50 + 15);
      expect(times).to.equal(0);
    });

    it('should resolve: edgeX/Y + offsetX/Y are visible', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.25 - 15, innerHeight + targetSize * 0.50 - 15);
      expect(times).to.equal(1);
    });
  });

  /**
   * edgeX/Y + offsetX/Y (negative)
   */
  describe('edgeX/Y + offsetX/Y (negative)', () => {
    // let times = 0;

    let times = 0;

    before(() => addObserver(new Tracker({
      targets: targetSelector,
      snapshots: [
        {
          edgeX: 25,
          edgeY: 50,
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

    it('should reject: scrollX/Y < edgeX/Y + offsetX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(50, 50);
      expect(times).to.equal(0);
    });

    it('should reject: scrollX/Y > edgeX/Y + offsetX/Y', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.25, innerHeight + targetSize * 0.50);
      expect(times).to.equal(0);
    });

    it('should resolve: edgeX/Y + offsetX/Y are visible', async () => {
      createTarget({ marginTop: `${innerHeight}px`, marginLeft: `${innerWidth}px` });

      await scroll(innerWidth + targetSize * 0.25 - 20, innerHeight + targetSize * 0.50 - 15);
      expect(times).to.equal(1);
    });
  });
});
