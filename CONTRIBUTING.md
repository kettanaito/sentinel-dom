# Contributing
First of all, let me thank you for deciding to contribute to Sentinel DOM!

## Getting started
These steps will take you through the process of contributing to the repository:

1. Fork Sentinel DOM,
1. Create a new branch (feature/bug). Follow the [Git workflow](#git-workflow),
1. Submit a new pull request from the forked repository. Select the original repository as the target for your pull request,
1. Provide what is needed for [test coverage](#tests),
1. Undergo the process of code review and merging the code.

There are additional suggestions depending on whether you are about to submit a [new feature](#new-features) or a [bugfix](#bugfixes).

### Git workflow
1. Fork the repository.
2. Create a new branch with the prefix `bug` when submitting a bugfix, or `feature` when submitting a new feature. The branch name should look like this: `feature/auto-tracking`.
3. Implement your changes.
4. Rebase your branch relatively to the current `master` in the *original* repository.
4. Create a new pull request in your fork repository. Select an original repository as a target branch.
5. Await a code review and provide the changes to the code, when necessary.

### Tests
* Your contribution should not decrease the test coverage of the library
* Your contribution (code) should be covered with the corresponding tests
* All tests should pass

Take it as a rule of thumb to run tests before submitting a pull request:
```
npm test
```
This will run both Node and browser (Chrome) tests in the console. Ensure there is no tests failing, otherwise fix the issues causing tests to fail.

## New features
1. Make sure a similar feature has not been already suggested (see the [Issues](https://github.com/kettanaito/sentinel-dom/issues)),
1. Fill in the issue template, describing your great feature,
1. Submit a [pull request](https://github.com/kettanaito/sentinel-dom/compare), if you know how to get the feature done. Otherwise, participate in the discussion with the library maintainers, to shape the best out of the feature.

## Bugfixes
1. Make sure the bug you are about to report has not been already submitted (see the [Issues](https://github.com/kettanaito/sentinel-dom/issues)),
1. Fill in the issue template with the requested information. This helps tremendously to investigate and resolve the bugs,
1. Submit a [pull request](https://github.com/kettanaito/sentinel-dom/compare) if you already know the solution for the issue
1. Follow the process of code review and merging the fix.

Have you had any questions, feel free to reach out to any of the library's contributors. Thank you.
