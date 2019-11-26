export const mapResults = x => {
  const parseArn = arn => {
    const s = arn.split(":")[5].split("/");
    return [s[1], s[3]];
  };

  const result = [];

  x.forEach(project =>
    project.ProjectVersionDescriptions.forEach(version => {
      const [projectName, versionName] = parseArn(version.ProjectVersionArn);
      result.push({
        project: projectName,
        version: versionName,
        details: version
      });
    })
  );

  return result.sort((a, b) => {
    const s = x => `${x.project}/${x.details.CreationTimestamp}`;
    return s(a) > s(b) ? 1 : s(a) < s(b) ? -1 : 0;
  });
};
