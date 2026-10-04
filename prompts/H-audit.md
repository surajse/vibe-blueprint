Audit the last changes for hallucinations. For every external import, package,
function call, env var, table/column and file path introduced: show where it is
defined (file path / official doc URL / `npm view` output). Mark anything you cannot
prove as UNVERIFIED. Then fix or remove all UNVERIFIED items.
