export const mapResults = (data, type) => {
  const parseArn = arn => {
    const s = arn.split(":")[5].split("/");
    return [s[1], s[3]];
  };

  const result = [];

  data.forEach(project =>
    project.ProjectVersionDescriptions.forEach(version => {
      const [projectName, versionName] = parseArn(version.ProjectVersionArn);
      if (!type || version.Status === type)
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
