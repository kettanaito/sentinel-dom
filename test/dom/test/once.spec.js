/**
 * Once (unique impressions)
 */
describe('Once', () => {
  beforeEach(beforeEachHook);
  afterEach(afterEachHook);

  it('single snapshot (root.once)', async () => {
    let times = 0;
    const target = createTarget({ marginTop: '30px' });

    new Tracker({
      targets: target,
      once: true,
      snapshots: [
        {
          callback() { times++; }
        }
      ]
    });

    await scroll(0, 10);
    expect(times).to.equal(1);

    await scroll(0, 15);
    expect(times).to.equal(1);
  });

  it('single snapshot (snapshot[i].once)', async () => {
    let times = 0;
    const target = createTarget({ marginTop: '30px' });

    new Tracker({
      targets: target,
      snapshots: [
        {
          once: true,
          callback() { times++; }
        }
      ]
    });

    await scroll(0, 10);
    expect(times).to.equal(1);

    await scroll(0, 15);
    expect(times).to.equal(1);
  });

  it('multiple snapshots (root.once)', async () => {
    let times = 0;
    const target = createTarget({ marginTop: '30px' });

    new Tracker({
      targets: target,
      once: true,
      snapshots: [
        {
          callback() { times++; }
        },
        {
          edgeY: 15,
          callback() { times++; }
        }
      ]
    });

    await scroll(0, 10);
    expect(times).to.equal(2);

    await scroll(0, 15);
    expect(times).to.equal(2);
  });

  it('multiple snapshots (root.once) with "false" for a single snapshot', async () => {
    let times = 0;
    const target = createTarget({ marginTop: '30px' });

    new Tracker({
      targets: target,
      once: true,
      snapshots: [
        {
          callback() { times++; }
        },
        {
          once: false,
          edgeY: 10,
          callback() { times++; }
        }
      ]
    });

    await scroll(0, 10);
    expect(times).to.equal(2);

    await scroll(0, 15);
    expect(times).to.equal(3);
  });

  it('multiple snapshots with different "once"', async () => {
    let times = 0;
    const target = createTarget({ marginTop: '30px' });

    new Tracker({
      targets: target,
      snapshots: [
        {
          once: true,
          callback() { times++; }
        },
        {
          edgeY: 10,
          callback() { times++; }
        }
      ]
    });

    await scroll(0, 10);
    expect(times).to.equal(2);

    await scroll(0, 15);
    expect(times).to.equal(3);
  });
});
