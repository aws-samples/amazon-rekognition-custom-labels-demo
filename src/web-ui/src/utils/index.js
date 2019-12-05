export const mapResults = (data, type) => {
  const parseArn = arn => {
    const s = arn.split(":")[5].split("/");
    return [s[1], s[3]];
  };

  const result = {};

  data.forEach(project =>
    project.ProjectVersionDescriptions.forEach(version => {
      const [projectName, versionName] = parseArn(version.ProjectVersionArn);
      if (!type || version.Status === type) {
        result[projectName] = result[projectName] || [];
        result[projectName].unshift({
          version: versionName,
          details: version
        });
      }
    })
  );

  return result;
};

const MAX_RETRIES = 3;
const RETRY_START = 1000;

export const retryWrapper = (p, timeout, retryN) =>
  new Promise((resolve, reject) =>
    p()
      .then(resolve)
      .catch(e => {
        if (retryN === MAX_RETRIES) return reject(e);
        const t = (timeout || RETRY_START / 2) * 2;
        const r = (retryN || 0) + 1;
        console.log(`Retry n. ${r} in ${t / 1000}s...`);
        setTimeout(
          () =>
            retryWrapper(p, t, r)
              .then(resolve)
              .catch(reject),
          t
        );
      })
  );

export const formatErrorMessage = e => {
  let msg = "An error happened";
  if (e.response) {
    if (e.response.status) msg += ` (${e.response.status} status code)`;
    if (e.response.data && e.response.data.Message)
      msg += `: ${e.response.data.Message}`;
  }

  return msg;
};
