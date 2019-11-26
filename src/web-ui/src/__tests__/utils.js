import { mapResults } from "../utils";

test("mapResults correctly flattens and filters results", () => {
  const result = [
    {
      ProjectVersionDescriptions: [
        {
          foo: "bar",
          CreationTimestamp: 1574706469.909,
          ProjectVersionArn:
            "arn:aws:rekognition:us-east-1:123456123456:project/test1/version/v2/1234561234567",
          Status: "TRAINING_COMPLETED"
        },
        {
          foo: "baz",
          CreationTimestamp: 1574705975.94,
          ProjectVersionArn:
            "arn:aws:rekognition:us-east-1:123456123456:project/test1/version/v1/1234561234567",
          Status: "TRAINING_FAILED"
        }
      ]
    },
    {
      ProjectVersionDescriptions: [
        {
          foo: "bars",
          CreationTimestamp: 1574705222.164,
          ProjectVersionArn:
            "arn:aws:rekognition:us-east-1:123456123456:project/test2/version/v2/1234561234567",
          Status: "TRAINING_COMPLETED"
        },
        {
          foo: "barr",
          CreationTimestamp: 1574704909.947,
          ProjectVersionArn:
            "arn:aws:rekognition:us-east-1:123456123456:project/test2/version/v1/1234561234567",
          Status: "TRAINING_COMPLETED"
        }
      ]
    }
  ];

  const expected = [
    {
      project: "test1",
      version: "v1",
      details: {
        foo: "baz",
        CreationTimestamp: 1574705975.94,
        ProjectVersionArn:
          "arn:aws:rekognition:us-east-1:123456123456:project/test1/version/v1/1234561234567",
        Status: "TRAINING_FAILED"
      }
    },
    {
      project: "test1",
      version: "v2",
      details: {
        foo: "bar",
        CreationTimestamp: 1574706469.909,
        ProjectVersionArn:
          "arn:aws:rekognition:us-east-1:123456123456:project/test1/version/v2/1234561234567",
        Status: "TRAINING_COMPLETED"
      }
    },
    {
      project: "test2",
      version: "v1",
      details: {
        foo: "barr",
        CreationTimestamp: 1574704909.947,
        ProjectVersionArn:
          "arn:aws:rekognition:us-east-1:123456123456:project/test2/version/v1/1234561234567",
        Status: "TRAINING_COMPLETED"
      }
    },

    {
      project: "test2",
      version: "v2",
      details: {
        foo: "bars",
        CreationTimestamp: 1574705222.164,
        ProjectVersionArn:
          "arn:aws:rekognition:us-east-1:123456123456:project/test2/version/v2/1234561234567",
        Status: "TRAINING_COMPLETED"
      }
    }
  ];

  expect(mapResults(result)).toEqual(expected);
});
