import { mapResults } from "../utils";

const testData = [
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

test("mapResults correctly flattens results", () => {
  const expected = {
    test1: [
      {
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
        version: "v2",
        details: {
          foo: "bar",
          CreationTimestamp: 1574706469.909,
          ProjectVersionArn:
            "arn:aws:rekognition:us-east-1:123456123456:project/test1/version/v2/1234561234567",
          Status: "TRAINING_COMPLETED"
        }
      }
    ],
    test2: [
      {
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
        version: "v2",
        details: {
          foo: "bars",
          CreationTimestamp: 1574705222.164,
          ProjectVersionArn:
            "arn:aws:rekognition:us-east-1:123456123456:project/test2/version/v2/1234561234567",
          Status: "TRAINING_COMPLETED"
        }
      }
    ]
  };

  expect(mapResults(testData)).toEqual(expected);
});

test("mapResults correctly flattens and filters results", () => {
  const expected = {
    test1: [
      {
        version: "v1",
        details: {
          foo: "baz",
          CreationTimestamp: 1574705975.94,
          ProjectVersionArn:
            "arn:aws:rekognition:us-east-1:123456123456:project/test1/version/v1/1234561234567",
          Status: "TRAINING_FAILED"
        }
      }
    ]
  };

  expect(mapResults(testData, "TRAINING_FAILED")).toEqual(expected);
});
