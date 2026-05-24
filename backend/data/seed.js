export const instructions = [
  "ADD", "ARG", "CMD", "COPY", "ENTRYPOINT", "ENV", "EXPOSE", "FROM", "HEALTHCHECK",
  "LABEL", "MAINTAINER", "ONBUILD", "RUN", "SHELL", "STOPSIGNAL", "USER", "VOLUME", "WORKDIR"
];

const meta = {
  ADD: ["Imports local or remote files, with archive extraction.", "Medium"],
  ARG: ["Defines build-time variables.", "Beginner"],
  CMD: ["Sets the default startup command.", "Beginner"],
  COPY: ["Copies files from your project into the image.", "Beginner"],
  ENTRYPOINT: ["Defines the fixed executable for startup.", "Advanced"],
  ENV: ["Sets environment variables.", "Beginner"],
  EXPOSE: ["Documents the port an app listens on.", "Beginner"],
  FROM: ["Chooses the base image.", "Beginner"],
  HEALTHCHECK: ["Checks whether the running app is healthy.", "Advanced"],
  LABEL: ["Adds metadata to an image.", "Beginner"],
  MAINTAINER: ["Legacy author metadata instruction.", "Advanced"],
  ONBUILD: ["Registers triggers for child builds.", "Advanced"],
  RUN: ["Executes commands while building the image.", "Beginner"],
  SHELL: ["Changes the shell used by RUN commands.", "Advanced"],
  STOPSIGNAL: ["Sets the signal used to stop the app.", "Advanced"],
  USER: ["Switches the user for later commands.", "Medium"],
  VOLUME: ["Marks a path for persisted or shared data.", "Medium"],
  WORKDIR: ["Sets the working folder for later instructions.", "Beginner"]
};

const plain = {
  ADD: "ADD brings something into the app package. It can also unpack a zipped folder while putting it there.",
  ARG: "ARG is a temporary choice you can pass in while making the app package, like choosing a version number.",
  CMD: "CMD says what should start when someone opens the finished app package.",
  COPY: "COPY means taking files from your computer and placing them inside the app package so the app can use them.",
  ENTRYPOINT: "ENTRYPOINT is the main thing that always runs when the app package is opened.",
  ENV: "ENV saves a setting the app can read later, like a language, address, or mode.",
  EXPOSE: "EXPOSE is a note that says which door number the app expects visitors to use.",
  FROM: "FROM chooses the starting kit your app package is built from.",
  HEALTHCHECK: "HEALTHCHECK is a regular check that asks, 'Is this app still working?'",
  LABEL: "LABEL attaches helpful notes to the app package, like owner, version, or description.",
  MAINTAINER: "MAINTAINER is an older way to write who looked after the app package.",
  ONBUILD: "ONBUILD saves an instruction that runs later when another app package uses this one as its starting kit.",
  RUN: "RUN performs a setup step while the app package is being made, like installing tools.",
  SHELL: "SHELL changes the command reader used for later setup steps.",
  STOPSIGNAL: "STOPSIGNAL chooses the stop message sent when the app needs to close.",
  USER: "USER chooses which account the app should use, so it does not always act like the boss of the computer.",
  VOLUME: "VOLUME marks a folder where important files should live outside the throwaway parts of the app package.",
  WORKDIR: "WORKDIR changes the current folder so later steps happen in the right place."
};

export function buildInstruction(name, index) {
  const [shortDescription, difficulty] = meta[name];
  const lower = name.toLowerCase();
  const scenarios = [
    {
      title: `${name} in a startup release`,
      story: `A product team preparing a Friday release uses ${name} so every build follows the same repeatable pattern.`,
      companyUsage: `Acme Cloud adds ${name} to its service Dockerfile during review to keep deployments predictable.`
    },
    {
      title: `${name} during CI handoff`,
      story: `A platform team teaches new developers where ${name} belongs before the automated build publishes an image.`,
      companyUsage: `Northwind Apps documents ${name} in its base templates so teams do not rediscover the same rule.`
    },
    {
      title: `${name} in incident cleanup`,
      story: `After a confusing production issue, engineers simplify the Dockerfile and use ${name} more clearly.`,
      companyUsage: `BrightBank records a ${name} example in its internal cookbook for future services.`
    }
  ];

  return {
    slug: lower,
    name,
    shortDescription,
    difficulty,
    progress: (index * 7) % 100,
    quizScore: (index * 11) % 100,
    explanations: {
      technical: `${name} is a Dockerfile instruction used while producing an OCI image. ${shortDescription} It affects image layers, runtime defaults, metadata, or build-time behavior depending on where it appears in the Dockerfile.`,
      industry: `When mentoring a delivery team, I describe ${name} as one of the instructions that keeps image builds readable and reviewable. Used well, it makes CI pipelines easier to reason about and gives operations teams fewer surprises during release.`,
      layman: plain[name]
    },
    scenarios,
    code: makeCode(name),
    quiz: [
      {
        id: `${lower}-mc`,
        type: "multiple-choice",
        prompt: `Which Dockerfile instruction is this lesson about?`,
        options: [name, "GIT", "PACKAGE", "BOOT"],
        answer: name,
        weakArea: "instruction recognition"
      },
      {
        id: `${lower}-blank`,
        type: "fill-blank",
        prompt: `Fill in the blank: ${name} is written as the first word of its Dockerfile line.`,
        answer: name,
        weakArea: "syntax"
      },
      {
        id: `${lower}-scenario`,
        type: "scenario",
        prompt: `A team wants the behavior described as: ${shortDescription} Which instruction should they consider?`,
        options: [name, "README", "BRANCH", "MERGE"],
        answer: name,
        weakArea: "real-world use"
      },
      {
        id: `${lower}-code`,
        type: "code",
        prompt: `In the code example, what instruction starts the highlighted Dockerfile concept?`,
        answer: name,
        weakArea: "code reading"
      }
    ]
  };
}

function makeCode(name) {
  const snippets = {
    ADD: "FROM alpine:3.20\nADD app.tar.gz /srv/app/\nCMD [\"ls\", \"/srv/app\"]",
    ARG: "FROM node:20-alpine\nARG APP_VERSION=dev\nLABEL version=$APP_VERSION\nCMD [\"node\", \"--version\"]",
    CMD: "FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nCMD [\"npm\", \"start\"]",
    COPY: "FROM node:20-alpine\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nCMD [\"npm\", \"start\"]",
    ENTRYPOINT: "FROM alpine:3.20\nENTRYPOINT [\"ping\"]\nCMD [\"localhost\"]",
    ENV: "FROM node:20-alpine\nENV NODE_ENV=production\nCMD [\"node\", \"server.js\"]",
    EXPOSE: "FROM nginx:alpine\nCOPY site/ /usr/share/nginx/html\nEXPOSE 80",
    FROM: "FROM node:20-alpine\nWORKDIR /app\nCMD [\"node\", \"--version\"]",
    HEALTHCHECK: "FROM nginx:alpine\nHEALTHCHECK CMD wget -qO- http://localhost || exit 1",
    LABEL: "FROM alpine:3.20\nLABEL org.opencontainers.image.source=\"https://example.com/app\"",
    MAINTAINER: "FROM alpine:3.20\nMAINTAINER legacy-team@example.com\nCMD [\"echo\", \"legacy metadata\"]",
    ONBUILD: "FROM node:20-alpine\nONBUILD COPY package.json .\nONBUILD RUN npm install",
    RUN: "FROM node:20-alpine\nWORKDIR /app\nCOPY package.json .\nRUN npm install",
    SHELL: "FROM mcr.microsoft.com/powershell:lts-alpine-3.20\nSHELL [\"pwsh\", \"-Command\"]\nRUN Write-Host 'hello'",
    STOPSIGNAL: "FROM nginx:alpine\nSTOPSIGNAL SIGQUIT",
    USER: "FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nUSER node\nCMD [\"node\", \"server.js\"]",
    VOLUME: "FROM postgres:16-alpine\nVOLUME [\"/var/lib/postgresql/data\"]",
    WORKDIR: "FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nCMD [\"npm\", \"start\"]"
  };
  return snippets[name];
}

export const seedInstructions = instructions.map(buildInstruction);
