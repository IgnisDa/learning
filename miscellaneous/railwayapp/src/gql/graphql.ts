/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
  DeploymentMeta: { input: any; output: any; }
  EventProperties: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The ServiceVariables scalar type represents values as the TypeScript type: Record<string, string>. Example: "{ foo: 'bar', baz: 'qux' }" */
  ServiceVariables: { input: any; output: any; }
  TemplateConfig: { input: any; output: any; }
  TemplateMetadata: { input: any; output: any; }
  TemplateServiceConfig: { input: any; output: any; }
  TemplateVolume: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type AccessRule = {
  __typename?: 'AccessRule';
  disallowed?: Maybe<Scalars['String']['output']>;
};

/** The aggregated usage of a single measurement. */
export type AggregatedUsage = {
  __typename?: 'AggregatedUsage';
  /** The measurement that was aggregated. */
  measurement: MetricMeasurement;
  /** The tags that were used to group the metric. Only the tags that were used in the `groupBy` will be present. */
  tags: MetricTags;
  /** The aggregated value. */
  value: Scalars['Float']['output'];
};

export type AllDomains = {
  __typename?: 'AllDomains';
  customDomains: Array<CustomDomain>;
  serviceDomains: Array<ServiceDomain>;
};

export type ApiToken = Node & {
  __typename?: 'ApiToken';
  displayToken: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  teamId?: Maybe<Scalars['String']['output']>;
};

export type ApiTokenCreateInput = {
  name: Scalars['String']['input'];
  teamId?: InputMaybe<Scalars['String']['input']>;
};

export type BanReasonHistory = Node & {
  __typename?: 'BanReasonHistory';
  actor: User;
  banReason?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
};

export type BaseEnvironmentOverrideInput = {
  baseEnvironmentOverrideId?: InputMaybe<Scalars['String']['input']>;
};

/** The billing period for a customers subscription. */
export type BillingPeriod = {
  __typename?: 'BillingPeriod';
  end: Scalars['DateTime']['output'];
  start: Scalars['DateTime']['output'];
};

export enum Builder {
  Heroku = 'HEROKU',
  Nixpacks = 'NIXPACKS',
  Paketo = 'PAKETO'
}

export enum CdnProvider {
  DetectedCdnProviderCloudflare = 'DETECTED_CDN_PROVIDER_CLOUDFLARE',
  DetectedCdnProviderUnspecified = 'DETECTED_CDN_PROVIDER_UNSPECIFIED',
  Unrecognized = 'UNRECOGNIZED'
}

export type CertificatePublicData = {
  __typename?: 'CertificatePublicData';
  domainNames: Array<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  fingerprintSha256: Scalars['String']['output'];
  issuedAt?: Maybe<Scalars['DateTime']['output']>;
  keyType: KeyType;
};

export enum CertificateStatus {
  CertificateStatusTypeIssueFailed = 'CERTIFICATE_STATUS_TYPE_ISSUE_FAILED',
  CertificateStatusTypeIssuing = 'CERTIFICATE_STATUS_TYPE_ISSUING',
  CertificateStatusTypeUnspecified = 'CERTIFICATE_STATUS_TYPE_UNSPECIFIED',
  CertificateStatusTypeValid = 'CERTIFICATE_STATUS_TYPE_VALID',
  Unrecognized = 'UNRECOGNIZED'
}

/** [Experimental] A changeset represents a single change to a service, plugin or variable. */
export type Changeset = Node & {
  __typename?: 'Changeset';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  mergedFrom?: Maybe<Environment>;
  payload: Scalars['JSON']['output'];
  plugin?: Maybe<Plugin>;
  service?: Maybe<Service>;
  user?: Maybe<User>;
};

/** [Experimental] An accumulated set of changes calculated from comparing two environments. */
export type ChangesetDiff = {
  __typename?: 'ChangesetDiff';
  payload: Scalars['JSON']['output'];
  plugin?: Maybe<Plugin>;
  service?: Maybe<Service>;
};

export type CnameCheck = {
  __typename?: 'CnameCheck';
  link?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  status: CnameCheckStatus;
};

export enum CnameCheckStatus {
  Error = 'ERROR',
  Info = 'INFO',
  Invalid = 'INVALID',
  Valid = 'VALID',
  Waiting = 'WAITING'
}

export type Container = Node & {
  __typename?: 'Container';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  environmentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pluginId: Scalars['String']['output'];
};

export type Credit = Node & {
  __typename?: 'Credit';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  memo?: Maybe<Scalars['String']['output']>;
  type: CreditType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum CreditType {
  Applied = 'APPLIED',
  Credit = 'CREDIT',
  Debit = 'DEBIT',
  Stripe = 'STRIPE',
  Waived = 'WAIVED'
}

export type CustomDomain = Domain & {
  __typename?: 'CustomDomain';
  /** @deprecated Use the `status` field instead. */
  cnameCheck: CnameCheck;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  domain: Scalars['String']['output'];
  environmentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  serviceId: Scalars['String']['output'];
  status: CustomDomainStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CustomDomainCreateInput = {
  domain: Scalars['String']['input'];
  environmentId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};

export type CustomDomainStatus = {
  __typename?: 'CustomDomainStatus';
  cdnProvider?: Maybe<CdnProvider>;
  certificateStatus: CertificateStatus;
  certificates?: Maybe<Array<CertificatePublicData>>;
  dnsRecords: Array<DnsRecords>;
};

export type Customer = Node & {
  __typename?: 'Customer';
  appliedCredits: Scalars['Float']['output'];
  billingEmail?: Maybe<Scalars['String']['output']>;
  billingPeriod: BillingPeriod;
  creditBalance: Scalars['Float']['output'];
  credits: CustomerCreditsConnection;
  defaultPaymentMethod?: Maybe<PaymentMethod>;
  defaultPaymentMethodId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoices: Array<CustomerInvoice>;
  isPrepaying: Scalars['Boolean']['output'];
  isTrialing: Scalars['Boolean']['output'];
  isUsageSubscriber: Scalars['Boolean']['output'];
  remainingUsageCreditBalance: Scalars['Float']['output'];
  state: SubscriptionState;
  stripeCustomerId: Scalars['String']['output'];
  subscriptions: Array<CustomerSubscription>;
  teamId?: Maybe<Scalars['String']['output']>;
  usageLimit?: Maybe<UsageLimit>;
  userId?: Maybe<Scalars['String']['output']>;
};


export type CustomerCreditsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type CustomerCreditsConnection = {
  __typename?: 'CustomerCreditsConnection';
  edges: Array<CustomerCreditsConnectionEdge>;
  pageInfo: PageInfo;
};

export type CustomerCreditsConnectionEdge = {
  __typename?: 'CustomerCreditsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Credit;
};

export type CustomerInvoice = {
  __typename?: 'CustomerInvoice';
  amountPaid: Scalars['Float']['output'];
  hostedURL?: Maybe<Scalars['String']['output']>;
  invoiceId: Scalars['String']['output'];
  items: Array<SubscriptionItem>;
  paymentIntentStatus?: Maybe<Scalars['String']['output']>;
  pdfURL?: Maybe<Scalars['String']['output']>;
  periodEnd: Scalars['String']['output'];
  periodStart: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  subscriptionId?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type CustomerSubscription = {
  __typename?: 'CustomerSubscription';
  billingCycleAnchor: Scalars['DateTime']['output'];
  cancelAt?: Maybe<Scalars['String']['output']>;
  cancelAtPeriodEnd: Scalars['Boolean']['output'];
  couponId?: Maybe<Scalars['String']['output']>;
  discounts: Array<SubscriptionDiscount>;
  id: Scalars['String']['output'];
  items: Array<SubscriptionItem>;
  latestInvoiceId: Scalars['String']['output'];
  nextInvoiceCurrentTotal: Scalars['Int']['output'];
  nextInvoiceDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export enum DnsRecordPurpose {
  DnsRecordPurposeAcmeDns01Challenge = 'DNS_RECORD_PURPOSE_ACME_DNS01_CHALLENGE',
  DnsRecordPurposeTrafficRoute = 'DNS_RECORD_PURPOSE_TRAFFIC_ROUTE',
  DnsRecordPurposeUnspecified = 'DNS_RECORD_PURPOSE_UNSPECIFIED',
  Unrecognized = 'UNRECOGNIZED'
}

export enum DnsRecordStatus {
  DnsRecordStatusPropagated = 'DNS_RECORD_STATUS_PROPAGATED',
  DnsRecordStatusRequiresUpdate = 'DNS_RECORD_STATUS_REQUIRES_UPDATE',
  DnsRecordStatusUnspecified = 'DNS_RECORD_STATUS_UNSPECIFIED',
  Unrecognized = 'UNRECOGNIZED'
}

export enum DnsRecordType {
  DnsRecordTypeA = 'DNS_RECORD_TYPE_A',
  DnsRecordTypeCname = 'DNS_RECORD_TYPE_CNAME',
  DnsRecordTypeNs = 'DNS_RECORD_TYPE_NS',
  DnsRecordTypeUnspecified = 'DNS_RECORD_TYPE_UNSPECIFIED',
  Unrecognized = 'UNRECOGNIZED'
}

export type DnsRecords = {
  __typename?: 'DNSRecords';
  currentValue: Scalars['String']['output'];
  fqdn: Scalars['String']['output'];
  hostlabel: Scalars['String']['output'];
  purpose: DnsRecordPurpose;
  recordType: DnsRecordType;
  requiredValue: Scalars['String']['output'];
  status: DnsRecordStatus;
  zone: Scalars['String']['output'];
};

export type Deployment = Node & {
  __typename?: 'Deployment';
  canRedeploy: Scalars['Boolean']['output'];
  canRollback: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  environment: Environment;
  environmentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  meta?: Maybe<Scalars['DeploymentMeta']['output']>;
  projectId: Scalars['String']['output'];
  service: Service;
  serviceId?: Maybe<Scalars['String']['output']>;
  snapshotId?: Maybe<Scalars['String']['output']>;
  staticUrl?: Maybe<Scalars['String']['output']>;
  status: DeploymentStatus;
  suggestAddServiceDomain: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type DeploymentListInput = {
  environmentId?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<DeploymentStatusInput>;
};

export type DeploymentSnapshot = Node & {
  __typename?: 'DeploymentSnapshot';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum DeploymentStatus {
  Building = 'BUILDING',
  Crashed = 'CRASHED',
  Deploying = 'DEPLOYING',
  Failed = 'FAILED',
  Initializing = 'INITIALIZING',
  Queued = 'QUEUED',
  Removed = 'REMOVED',
  Removing = 'REMOVING',
  Skipped = 'SKIPPED',
  Success = 'SUCCESS',
  Waiting = 'WAITING'
}

export type DeploymentStatusInput = {
  in?: InputMaybe<Array<DeploymentStatus>>;
  notIn?: InputMaybe<Array<DeploymentStatus>>;
};

export type DeploymentTrigger = Node & {
  __typename?: 'DeploymentTrigger';
  baseEnvironmentOverrideId?: Maybe<Scalars['String']['output']>;
  branch: Scalars['String']['output'];
  checkSuites: Scalars['Boolean']['output'];
  environmentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  projectId: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  repository: Scalars['String']['output'];
  serviceId?: Maybe<Scalars['String']['output']>;
  validCheckSuites: Scalars['Int']['output'];
};

export type DeploymentTriggerCreateInput = {
  branch: Scalars['String']['input'];
  checkSuites?: InputMaybe<Scalars['Boolean']['input']>;
  environmentId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  provider: Scalars['String']['input'];
  repository: Scalars['String']['input'];
  rootDirectory?: InputMaybe<Scalars['String']['input']>;
  serviceId: Scalars['String']['input'];
};

export type DeploymentTriggerUpdateInput = {
  branch?: InputMaybe<Scalars['String']['input']>;
  checkSuites?: InputMaybe<Scalars['Boolean']['input']>;
  repository?: InputMaybe<Scalars['String']['input']>;
  rootDirectory?: InputMaybe<Scalars['String']['input']>;
};

export type Domain = {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  domain: Scalars['String']['output'];
  environmentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  serviceId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type DomainAvailable = {
  __typename?: 'DomainAvailable';
  available: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type DomainWithStatus = {
  __typename?: 'DomainWithStatus';
  cdnProvider?: Maybe<CdnProvider>;
  certificateStatus: CertificateStatus;
  certificates?: Maybe<Array<CertificatePublicData>>;
  dnsRecords: Array<DnsRecords>;
  domain?: Maybe<Domain>;
};

export type Environment = Node & {
  __typename?: 'Environment';
  /** [Experimental] Returns the diff between this environment and its parent one. */
  changes: Array<ChangesetDiff>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  deploymentTriggers: EnvironmentDeploymentTriggersConnection;
  deployments: EnvironmentDeploymentsConnection;
  id: Scalars['ID']['output'];
  isEphemeral: Scalars['Boolean']['output'];
  meta?: Maybe<EnvironmentMeta>;
  name: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  serviceInstances: EnvironmentServiceInstancesConnection;
  sourceEnvironment?: Maybe<Environment>;
  unmergedChangesCount?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  variables: EnvironmentVariablesConnection;
};


export type EnvironmentDeploymentTriggersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type EnvironmentDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type EnvironmentServiceInstancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type EnvironmentVariablesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type EnvironmentCreateInput = {
  ephemeral?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  /** [Experimental] Specifying this field will create a new environment that is a fork of the specified environment. Changes made to forked environments will not affect other environments, and vice versa. */
  sourceEnvironmentId?: InputMaybe<Scalars['String']['input']>;
};

export type EnvironmentDeploymentTriggersConnection = {
  __typename?: 'EnvironmentDeploymentTriggersConnection';
  edges: Array<EnvironmentDeploymentTriggersConnectionEdge>;
  pageInfo: PageInfo;
};

export type EnvironmentDeploymentTriggersConnectionEdge = {
  __typename?: 'EnvironmentDeploymentTriggersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: DeploymentTrigger;
};

export type EnvironmentDeploymentsConnection = {
  __typename?: 'EnvironmentDeploymentsConnection';
  edges: Array<EnvironmentDeploymentsConnectionEdge>;
  pageInfo: PageInfo;
};

export type EnvironmentDeploymentsConnectionEdge = {
  __typename?: 'EnvironmentDeploymentsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Deployment;
};

export type EnvironmentMeta = {
  __typename?: 'EnvironmentMeta';
  baseBranch?: Maybe<Scalars['String']['output']>;
  branch?: Maybe<Scalars['String']['output']>;
  prNumber?: Maybe<Scalars['Int']['output']>;
  prRepo?: Maybe<Scalars['String']['output']>;
  prTitle?: Maybe<Scalars['String']['output']>;
};

export type EnvironmentServiceInstancesConnection = {
  __typename?: 'EnvironmentServiceInstancesConnection';
  edges: Array<EnvironmentServiceInstancesConnectionEdge>;
  pageInfo: PageInfo;
};

export type EnvironmentServiceInstancesConnectionEdge = {
  __typename?: 'EnvironmentServiceInstancesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ServiceInstance;
};

export type EnvironmentTriggersDeployInput = {
  environmentId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};

export type EnvironmentVariablesConnection = {
  __typename?: 'EnvironmentVariablesConnection';
  edges: Array<EnvironmentVariablesConnectionEdge>;
  pageInfo: PageInfo;
};

export type EnvironmentVariablesConnectionEdge = {
  __typename?: 'EnvironmentVariablesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Variable;
};

/** The estimated usage of a single measurement. */
export type EstimatedUsage = {
  __typename?: 'EstimatedUsage';
  /** The estimated value. */
  estimatedValue: Scalars['Float']['output'];
  /** The measurement that was estimated. */
  measurement: MetricMeasurement;
  projectId: Scalars['String']['output'];
};

export type Event = Node & {
  __typename?: 'Event';
  action: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  environment?: Maybe<Environment>;
  environmentId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  object: Scalars['String']['output'];
  payload?: Maybe<Scalars['JSON']['output']>;
  project: Project;
  projectId: Scalars['String']['output'];
};

export type EventBatchTrackInput = {
  events: Array<EventTrackInput>;
};

export type EventTrackInput = {
  eventName: Scalars['String']['input'];
  properties?: InputMaybe<Scalars['EventProperties']['input']>;
  ts: Scalars['String']['input'];
};

export type ExplicitOwnerInput = {
  /** The ID of the owner */
  id: Scalars['String']['input'];
  /** The type of owner */
  type: ResourceOwnerType;
};

export type GitHubBranch = {
  __typename?: 'GitHubBranch';
  name: Scalars['String']['output'];
};

export type GitHubRepo = {
  __typename?: 'GitHubRepo';
  defaultBranch: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  installationId: Scalars['String']['output'];
  isPrivate: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type GitHubRepoUpdateInput = {
  environmentId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};

export type HerokuApp = {
  __typename?: 'HerokuApp';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type HerokuImportVariablesInput = {
  environmentId: Scalars['String']['input'];
  herokuAppId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};

export type Incident = {
  __typename?: 'Incident';
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  status: IncidentStatus;
  url: Scalars['String']['output'];
};

export enum IncidentStatus {
  Identified = 'IDENTIFIED',
  Investigating = 'INVESTIGATING',
  Monitoring = 'MONITORING',
  Resolved = 'RESOLVED'
}

export type Integration = Node & {
  __typename?: 'Integration';
  config: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
};

export type IntegrationAuth = Node & {
  __typename?: 'IntegrationAuth';
  id: Scalars['ID']['output'];
  integrations: IntegrationAuthIntegrationsConnection;
  provider: Scalars['String']['output'];
  providerId: Scalars['String']['output'];
};


export type IntegrationAuthIntegrationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type IntegrationAuthIntegrationsConnection = {
  __typename?: 'IntegrationAuthIntegrationsConnection';
  edges: Array<IntegrationAuthIntegrationsConnectionEdge>;
  pageInfo: PageInfo;
};

export type IntegrationAuthIntegrationsConnectionEdge = {
  __typename?: 'IntegrationAuthIntegrationsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Integration;
};

export type IntegrationCreateInput = {
  config: Scalars['JSON']['input'];
  integrationAuthId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type IntegrationUpdateInput = {
  config: Scalars['JSON']['input'];
  integrationAuthId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type InviteCode = Node & {
  __typename?: 'InviteCode';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  project: Project;
  projectId: Scalars['String']['output'];
  role: ProjectRole;
};

export type JobApplicationCreateInput = {
  email: Scalars['String']['input'];
  jobId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  resume: Scalars['Upload']['input'];
  why: Scalars['String']['input'];
};

export enum KeyType {
  KeyTypeEcdsa = 'KEY_TYPE_ECDSA',
  KeyTypeRsa_2048 = 'KEY_TYPE_RSA_2048',
  KeyTypeRsa_4096 = 'KEY_TYPE_RSA_4096',
  KeyTypeUnspecified = 'KEY_TYPE_UNSPECIFIED',
  Unrecognized = 'UNRECOGNIZED'
}

/** The result of a logs query. */
export type Log = {
  __typename?: 'Log';
  /** The attributes that were parsed from a structured log */
  attributes: Array<LogAttribute>;
  /** The contents of the log message */
  message: Scalars['String']['output'];
  /** The severity of the log message (eg. err) */
  severity?: Maybe<Scalars['String']['output']>;
  /** The tags that were associated with the log */
  tags?: Maybe<LogTags>;
  /** The timestamp of the log message in format RFC3339 (nano) */
  timestamp: Scalars['String']['output'];
};

/** The attributes associated with a structured log */
export type LogAttribute = {
  __typename?: 'LogAttribute';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** The tags associated with a specific log */
export type LogTags = {
  __typename?: 'LogTags';
  deploymentId?: Maybe<Scalars['String']['output']>;
  deploymentInstanceId?: Maybe<Scalars['String']['output']>;
  environmentId?: Maybe<Scalars['String']['output']>;
  pluginId?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  serviceId?: Maybe<Scalars['String']['output']>;
  snapshotId?: Maybe<Scalars['String']['output']>;
};

export type LoginSessionAuthInput = {
  code: Scalars['String']['input'];
  hostname?: InputMaybe<Scalars['String']['input']>;
};

export type Maintenance = {
  __typename?: 'Maintenance';
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  status: MaintenanceStatus;
  url: Scalars['String']['output'];
};

export enum MaintenanceStatus {
  Completed = 'COMPLETED',
  Inprogress = 'INPROGRESS',
  Notstartedyet = 'NOTSTARTEDYET'
}

export type MergeChange = {
  action: Scalars['String']['input'];
  name: Scalars['String']['input'];
  serviceId?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

/** A single sample of a metric. */
export type Metric = {
  __typename?: 'Metric';
  /** The timestamp of the sample. Represented has number of seconds since the Unix epoch. */
  ts: Scalars['Int']['output'];
  /** The value of the sample. */
  value: Scalars['Float']['output'];
};

/** A thing that can be measured on Railway. */
export enum MetricMeasurement {
  CpuUsage = 'CPU_USAGE',
  DiskUsageGb = 'DISK_USAGE_GB',
  EphemeralDiskUsageGb = 'EPHEMERAL_DISK_USAGE_GB',
  MeasurementUnspecified = 'MEASUREMENT_UNSPECIFIED',
  MemoryUsageGb = 'MEMORY_USAGE_GB',
  NetworkRxGb = 'NETWORK_RX_GB',
  NetworkTxGb = 'NETWORK_TX_GB',
  Unrecognized = 'UNRECOGNIZED'
}

/** A property that can be used to group metrics. */
export enum MetricTag {
  DeploymentId = 'DEPLOYMENT_ID',
  DeploymentInstanceId = 'DEPLOYMENT_INSTANCE_ID',
  EnvironmentId = 'ENVIRONMENT_ID',
  KeyUnspecified = 'KEY_UNSPECIFIED',
  PluginId = 'PLUGIN_ID',
  ProjectId = 'PROJECT_ID',
  ServiceId = 'SERVICE_ID',
  Unrecognized = 'UNRECOGNIZED',
  VolumeId = 'VOLUME_ID'
}

/** The tags that were used to group the metric. */
export type MetricTags = {
  __typename?: 'MetricTags';
  deploymentId?: Maybe<Scalars['String']['output']>;
  environmentId?: Maybe<Scalars['String']['output']>;
  pluginId?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  serviceId?: Maybe<Scalars['String']['output']>;
  volumeId?: Maybe<Scalars['String']['output']>;
};

/** The result of a metrics query. */
export type MetricsResult = {
  __typename?: 'MetricsResult';
  /** The measurement of the metric. */
  measurement: MetricMeasurement;
  /** The tags that were used to group the metric. Only the tags that were used to by will be present. */
  tags: MetricTags;
  /** The samples of the metric. */
  values: Array<Metric>;
};

export type MissingCommandAlertInput = {
  page: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new API token. */
  apiTokenCreate: Scalars['String']['output'];
  /** Deletes an API token. */
  apiTokenDelete: Scalars['Boolean']['output'];
  /** Sets the base environment override for a deployment trigger. */
  baseEnvironmentOverride: Scalars['Boolean']['output'];
  /** Creates a new custom domain. */
  customDomainCreate: CustomDomain;
  /** Deletes a custom domain. */
  customDomainDelete: Scalars['Boolean']['output'];
  /** Migrate a customer to the hobby plan */
  customerMigrateToHobbyPlan: Scalars['Boolean']['output'];
  /** Cancels a deployment. */
  deploymentCancel: Scalars['Boolean']['output'];
  /** Redeploys a deployment. */
  deploymentRedeploy: Deployment;
  /** Removes a deployment. */
  deploymentRemove: Scalars['Boolean']['output'];
  /** Restarts a deployment. */
  deploymentRestart: Scalars['Boolean']['output'];
  /** Rolls back to a deployment. */
  deploymentRollback: Scalars['Boolean']['output'];
  /** Creates a deployment trigger. */
  deploymentTriggerCreate: DeploymentTrigger;
  /** Deletes a deployment trigger. */
  deploymentTriggerDelete: Scalars['Boolean']['output'];
  /** Updates a deployment trigger. */
  deploymentTriggerUpdate: DeploymentTrigger;
  /** Change the User's account email if there is a valid change email request. */
  emailChangeConfirm: Scalars['Boolean']['output'];
  /** Initiate an email change request for a user */
  emailChangeInitiate: Scalars['Boolean']['output'];
  /** Creates a new environment. */
  environmentCreate: Environment;
  /** Deletes an environment. */
  environmentDelete: Scalars['Boolean']['output'];
  /** [Experimental] Merges the current environment with the parent one. */
  environmentMerge: Scalars['Boolean']['output'];
  /** Deploys all connected triggers for an environment. */
  environmentTriggersDeploy: Scalars['Boolean']['output'];
  /** Track a batch of events for authenticated user */
  eventBatchTrack: Scalars['Boolean']['output'];
  /** Track event for authenticated user */
  eventTrack: Scalars['Boolean']['output'];
  /** Agree to the fair use policy for the currently authenticated user */
  fairUseAgree: Scalars['Boolean']['output'];
  /** Updates a GitHub repo through the linked template */
  githubRepoUpdate: Scalars['Boolean']['output'];
  /** Import variables from a Heroku app into a Railway service. Returns the number of variables imports */
  herokuImportVariables: Scalars['Int']['output'];
  /** Create an integration for a project */
  integrationCreate: Integration;
  /** Delete an integration for a project */
  integrationDelete: Scalars['Boolean']['output'];
  /** Update an integration for a project */
  integrationUpdate: Integration;
  /** Join a project using an invite code */
  inviteCodeUse: Project;
  /** Creates a new job application. */
  jobApplicationCreate: Scalars['Boolean']['output'];
  /** Auth a login session for a user */
  loginSessionAuth: Scalars['Boolean']['output'];
  /** Cancel a login session */
  loginSessionCancel: Scalars['Boolean']['output'];
  /** Get a token for a login session if it exists */
  loginSessionConsume?: Maybe<Scalars['String']['output']>;
  /** Start a CLI login session */
  loginSessionCreate: Scalars['String']['output'];
  /** Verify if a login session is valid */
  loginSessionVerify: Scalars['Boolean']['output'];
  /** Deletes session for current user if it exists */
  logout: Scalars['Boolean']['output'];
  /** Alert the team of a missing command palette command */
  missingCommandAlert: Scalars['Boolean']['output'];
  /** Creates a new plugin. */
  pluginCreate: Plugin;
  /** Deletes a plugin. */
  pluginDelete: Scalars['Boolean']['output'];
  /** Reset envs and container for a plugin in an environment */
  pluginReset: Scalars['Boolean']['output'];
  /** Resets the credentials for a plugin in an environment */
  pluginResetCredentials: Scalars['String']['output'];
  /** Restarts a plugin. */
  pluginRestart: Plugin;
  /** Updates an existing plugin. */
  pluginUpdate: Plugin;
  /** Update the email preferences for a user */
  preferencesUpdate: Preferences;
  /** Create or get a private network. */
  privateNetworkCreateOrGet: PrivateNetwork;
  /** Create or get a private network endpoint. */
  privateNetworkEndpointCreateOrGet: PrivateNetworkEndpoint;
  /** Delete a private network endpoint. */
  privateNetworkEndpointDelete: Scalars['Boolean']['output'];
  /** Rename a private network endpoint. */
  privateNetworkEndpointRename: Scalars['Boolean']['output'];
  /** Delete all private networks for an environment. */
  privateNetworksForEnvironmentDelete: Scalars['Boolean']['output'];
  /** Claims a project. */
  projectClaim: Project;
  /** Creates a new project. */
  projectCreate: Project;
  /** Deletes a project. */
  projectDelete: Scalars['Boolean']['output'];
  /** Invite a user by email to a project */
  projectInviteUser: Scalars['Boolean']['output'];
  /** Leave project as currently authenticated user */
  projectLeave: Scalars['Boolean']['output'];
  /** Remove user from a project */
  projectMemberRemove: Array<ProjectMember>;
  /** Change the role for a user within a project */
  projectMemberUpdate: ProjectMember;
  /** Create a token for a project that has access to a specific environment */
  projectTokenCreate: Scalars['String']['output'];
  /** Delete a project token */
  projectTokenDelete: Scalars['Boolean']['output'];
  /** Confirm the transfer of project ownership */
  projectTransferConfirm: Scalars['Boolean']['output'];
  /** Initiate the transfer of project ownership */
  projectTransferInitiate: Scalars['Boolean']['output'];
  /** Transfer a project to a team */
  projectTransferToTeam: Scalars['Boolean']['output'];
  /** Transfer a project to a user */
  projectTransferToUser: Scalars['Boolean']['output'];
  /** Updates a project. */
  projectUpdate: Project;
  /** Deletes a ProviderAuth. */
  providerAuthRemove: Scalars['Boolean']['output'];
  /** Generates a new set of recovery codes for the authenticated user. */
  recoveryCodeGenerate: RecoveryCodes;
  /** Validates a recovery code. */
  recoveryCodeValidate: Scalars['Boolean']['output'];
  /** Updates the ReferralInfo for the authenticated user. */
  referralInfoUpdate: ReferralInfo;
  /** Connect a service to a source */
  serviceConnect: Service;
  /** Creates a new service. */
  serviceCreate: Service;
  /** Deletes a service. */
  serviceDelete: Scalars['Boolean']['output'];
  /** Disconnect a service from a repo */
  serviceDisconnect: Service;
  /** Creates a new service domain. */
  serviceDomainCreate: ServiceDomain;
  /** Deletes a service domain. */
  serviceDomainDelete: Scalars['Boolean']['output'];
  /** Updates a service domain. */
  serviceDomainUpdate: Scalars['Boolean']['output'];
  /** Redeploy a service instance */
  serviceInstanceRedeploy: Scalars['Boolean']['output'];
  /** Update a service instance */
  serviceInstanceUpdate: Scalars['Boolean']['output'];
  /** Remove the upstream URL from all service instances for this service */
  serviceRemoveUpstreamUrl: Service;
  /** Updates a service. */
  serviceUpdate: Service;
  /** Deletes a session. */
  sessionDelete: Scalars['Boolean']['output'];
  /** Configure a shared variable. */
  sharedVariableConfigure: Variable;
  /** Deletes a TCP proxy by id */
  tcpProxyDelete: Scalars['Boolean']['output'];
  /** Bulk transfer projects from user to team */
  teamBulkProjectTransfer: Scalars['Boolean']['output'];
  /** Create a team */
  teamCreate: Team;
  /** Create a team and subscribe to the Pro plan */
  teamCreateAndSubscribe: TeamCreateAndSubscribeResponse;
  /** Delete a team and all data associated with it */
  teamDelete: Scalars['Boolean']['output'];
  /** Get an invite code for a team and role */
  teamInviteCodeCreate: Scalars['String']['output'];
  /** Use an invite code to join a team */
  teamInviteCodeUse: Team;
  /** Leave a team */
  teamLeave: Scalars['Boolean']['output'];
  /** Changes a user team permissions. */
  teamPermissionChange: Scalars['Boolean']['output'];
  /** Update a team by id */
  teamUpdate: Team;
  /** Invite a user by email to a team */
  teamUserInvite: Scalars['Boolean']['output'];
  /** Remove a user from a team */
  teamUserRemove: Scalars['Boolean']['output'];
  /** Logs panics from CLI to Datadog */
  telemetrySend: Scalars['Boolean']['output'];
  /** Duplicates an existing template */
  templateClone: Template;
  /** Creates a template. */
  templateCreate: Template;
  /** Deletes a template. */
  templateDelete: Scalars['Boolean']['output'];
  /** Deploys a template. */
  templateDeploy: TemplateDeployPayload;
  /** Generate a template for a project */
  templateGenerate: Template;
  /** Publishes a template. */
  templatePublish: Template;
  /** Unpublishes a template. */
  templateUnpublish: Scalars['Boolean']['output'];
  /** Updates a template. */
  templateUpdate: Template;
  /** Setup 2FA authorization for authenticated user. */
  twoFactorInfoCreate: RecoveryCodes;
  /** Deletes the TwoFactorInfo for the authenticated user. */
  twoFactorInfoDelete: Scalars['Boolean']['output'];
  /** Generates the 2FA app secret for the authenticated user. */
  twoFactorInfoSecret: TwoFactorInfoSecret;
  /** Validates the token for a 2FA action or for a login request. */
  twoFactorInfoValidate: Scalars['Boolean']['output'];
  /** Remove the usage limit for a customer */
  usageLimitRemove: Scalars['Boolean']['output'];
  /** Set the usage limit for a customer */
  usageLimitSet: Scalars['Boolean']['output'];
  /** Unsubscribe from the Beta program. */
  userBetaLeave: Scalars['Boolean']['output'];
  /** Delete the currently authenticated user */
  userDelete: Scalars['Boolean']['output'];
  /** Disconnect your Railway account from Discord. */
  userDiscordDisconnect: Scalars['Boolean']['output'];
  /** Remove a flag on the user. */
  userFlagsRemove: Scalars['Boolean']['output'];
  /** Set flags on the authenticated user. */
  userFlagsSet: Scalars['Boolean']['output'];
  /** Update date of TermsAgreedOn */
  userTermsUpdate?: Maybe<User>;
  /** Update currently logged in user */
  userUpdate?: Maybe<User>;
  /** Upserts a collection of variables. */
  variableCollectionUpsert: Scalars['Boolean']['output'];
  /** Deletes a variable. */
  variableDelete: Scalars['Boolean']['output'];
  /** Upserts a variable. */
  variableUpsert: Scalars['Boolean']['output'];
  /** Create a persistent volume in a project */
  volumeCreate: Volume;
  /** Delete a persistent volume in a project */
  volumeDelete: Scalars['Boolean']['output'];
  /** Update a volume instance. If no environmentId is provided, all volume instances for the volume will be updated. */
  volumeInstanceUpdate: Scalars['Boolean']['output'];
  /** Update a persistent volume in a project */
  volumeUpdate: Volume;
  /** Create a webhook on a project */
  webhookCreate: ProjectWebhook;
  /** Delete a webhook from a project */
  webhookDelete: Scalars['Boolean']['output'];
  /** Update a webhook on a project */
  webhookUpdate: ProjectWebhook;
};


export type MutationApiTokenCreateArgs = {
  input: ApiTokenCreateInput;
};


export type MutationApiTokenDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationBaseEnvironmentOverrideArgs = {
  id: Scalars['String']['input'];
  input: BaseEnvironmentOverrideInput;
};


export type MutationCustomDomainCreateArgs = {
  input: CustomDomainCreateInput;
};


export type MutationCustomDomainDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationCustomerMigrateToHobbyPlanArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeploymentCancelArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeploymentRedeployArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeploymentRemoveArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeploymentRestartArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeploymentRollbackArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeploymentTriggerCreateArgs = {
  input: DeploymentTriggerCreateInput;
};


export type MutationDeploymentTriggerDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeploymentTriggerUpdateArgs = {
  id: Scalars['String']['input'];
  input: DeploymentTriggerUpdateInput;
};


export type MutationEmailChangeConfirmArgs = {
  nonce: Scalars['String']['input'];
};


export type MutationEmailChangeInitiateArgs = {
  newEmail: Scalars['String']['input'];
};


export type MutationEnvironmentCreateArgs = {
  input: EnvironmentCreateInput;
};


export type MutationEnvironmentDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationEnvironmentMergeArgs = {
  changes?: InputMaybe<Array<MergeChange>>;
  id: Scalars['String']['input'];
};


export type MutationEnvironmentTriggersDeployArgs = {
  input: EnvironmentTriggersDeployInput;
};


export type MutationEventBatchTrackArgs = {
  input: EventBatchTrackInput;
};


export type MutationEventTrackArgs = {
  input: EventTrackInput;
};


export type MutationFairUseAgreeArgs = {
  agree: Scalars['Boolean']['input'];
};


export type MutationGithubRepoUpdateArgs = {
  input: GitHubRepoUpdateInput;
};


export type MutationHerokuImportVariablesArgs = {
  input: HerokuImportVariablesInput;
};


export type MutationIntegrationCreateArgs = {
  input: IntegrationCreateInput;
};


export type MutationIntegrationDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationIntegrationUpdateArgs = {
  id: Scalars['String']['input'];
  input: IntegrationUpdateInput;
};


export type MutationInviteCodeUseArgs = {
  code: Scalars['String']['input'];
};


export type MutationJobApplicationCreateArgs = {
  input: JobApplicationCreateInput;
};


export type MutationLoginSessionAuthArgs = {
  input: LoginSessionAuthInput;
};


export type MutationLoginSessionCancelArgs = {
  code: Scalars['String']['input'];
};


export type MutationLoginSessionConsumeArgs = {
  code: Scalars['String']['input'];
};


export type MutationLoginSessionVerifyArgs = {
  code: Scalars['String']['input'];
};


export type MutationMissingCommandAlertArgs = {
  input: MissingCommandAlertInput;
};


export type MutationPluginCreateArgs = {
  input: PluginCreateInput;
};


export type MutationPluginDeleteArgs = {
  environmentId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type MutationPluginResetArgs = {
  id: Scalars['String']['input'];
  input: ResetPluginInput;
};


export type MutationPluginResetCredentialsArgs = {
  id: Scalars['String']['input'];
  input: ResetPluginCredentialsInput;
};


export type MutationPluginRestartArgs = {
  id: Scalars['String']['input'];
  input: PluginRestartInput;
};


export type MutationPluginUpdateArgs = {
  id: Scalars['String']['input'];
  input: PluginUpdateInput;
};


export type MutationPreferencesUpdateArgs = {
  input: PreferencesUpdateData;
};


export type MutationPrivateNetworkCreateOrGetArgs = {
  input: PrivateNetworkCreateOrGetInput;
};


export type MutationPrivateNetworkEndpointCreateOrGetArgs = {
  input: PrivateNetworkEndpointCreateOrGetInput;
};


export type MutationPrivateNetworkEndpointDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationPrivateNetworkEndpointRenameArgs = {
  dnsName: Scalars['String']['input'];
  id: Scalars['String']['input'];
  privateNetworkId: Scalars['String']['input'];
};


export type MutationPrivateNetworksForEnvironmentDeleteArgs = {
  environmentId: Scalars['String']['input'];
};


export type MutationProjectClaimArgs = {
  id: Scalars['String']['input'];
};


export type MutationProjectCreateArgs = {
  input: ProjectCreateInput;
};


export type MutationProjectDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationProjectInviteUserArgs = {
  id: Scalars['String']['input'];
  input: ProjectInviteUserInput;
};


export type MutationProjectLeaveArgs = {
  id: Scalars['String']['input'];
};


export type MutationProjectMemberRemoveArgs = {
  input: ProjectMemberRemoveInput;
};


export type MutationProjectMemberUpdateArgs = {
  input: ProjectMemberUpdateInput;
};


export type MutationProjectTokenCreateArgs = {
  input: ProjectTokenCreateInput;
};


export type MutationProjectTokenDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationProjectTransferConfirmArgs = {
  input: ProjectTransferConfirmInput;
};


export type MutationProjectTransferInitiateArgs = {
  input: ProjectTransferInitiateInput;
};


export type MutationProjectTransferToTeamArgs = {
  id: Scalars['String']['input'];
  input: ProjectTransferToTeamInput;
};


export type MutationProjectTransferToUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationProjectUpdateArgs = {
  id: Scalars['String']['input'];
  input: ProjectUpdateInput;
};


export type MutationProviderAuthRemoveArgs = {
  id: Scalars['String']['input'];
};


export type MutationRecoveryCodeValidateArgs = {
  input: RecoveryCodeValidateInput;
};


export type MutationReferralInfoUpdateArgs = {
  input: ReferralInfoUpdateInput;
};


export type MutationServiceConnectArgs = {
  id: Scalars['String']['input'];
  input: ServiceConnectInput;
};


export type MutationServiceCreateArgs = {
  input: ServiceCreateInput;
};


export type MutationServiceDeleteArgs = {
  environmentId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type MutationServiceDisconnectArgs = {
  id: Scalars['String']['input'];
};


export type MutationServiceDomainCreateArgs = {
  input: ServiceDomainCreateInput;
};


export type MutationServiceDomainDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationServiceDomainUpdateArgs = {
  input: ServiceDomainUpdateInput;
};


export type MutationServiceInstanceRedeployArgs = {
  environmentId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};


export type MutationServiceInstanceUpdateArgs = {
  environmentId?: InputMaybe<Scalars['String']['input']>;
  input: ServiceInstanceUpdateInput;
  serviceId: Scalars['String']['input'];
};


export type MutationServiceRemoveUpstreamUrlArgs = {
  id: Scalars['String']['input'];
};


export type MutationServiceUpdateArgs = {
  id: Scalars['String']['input'];
  input: ServiceUpdateInput;
};


export type MutationSessionDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationSharedVariableConfigureArgs = {
  input: SharedVariableConfigureInput;
};


export type MutationTcpProxyDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationTeamBulkProjectTransferArgs = {
  input: TeamBulkProjectTransferInput;
};


export type MutationTeamCreateArgs = {
  input: TeamCreateInput;
};


export type MutationTeamCreateAndSubscribeArgs = {
  input: TeamCreateAndSubscribeInput;
};


export type MutationTeamDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationTeamInviteCodeCreateArgs = {
  id: Scalars['String']['input'];
  input: TeamInviteCodeCreateInput;
};


export type MutationTeamInviteCodeUseArgs = {
  code: Scalars['String']['input'];
};


export type MutationTeamLeaveArgs = {
  id: Scalars['String']['input'];
};


export type MutationTeamPermissionChangeArgs = {
  input: TeamPermissionChangeInput;
};


export type MutationTeamUpdateArgs = {
  id: Scalars['String']['input'];
  input: TeamUpdateInput;
};


export type MutationTeamUserInviteArgs = {
  id: Scalars['String']['input'];
  input: TeamUserInviteInput;
};


export type MutationTeamUserRemoveArgs = {
  id: Scalars['String']['input'];
  input: TeamUserRemoveInput;
};


export type MutationTelemetrySendArgs = {
  input: TelemetrySendInput;
};


export type MutationTemplateCloneArgs = {
  code: Scalars['String']['input'];
};


export type MutationTemplateCreateArgs = {
  input: TemplateCreateInput;
};


export type MutationTemplateDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationTemplateDeployArgs = {
  input: TemplateDeployInput;
};


export type MutationTemplateGenerateArgs = {
  input: TemplateGenerateInput;
};


export type MutationTemplatePublishArgs = {
  id: Scalars['String']['input'];
  input: TemplatePublishInput;
};


export type MutationTemplateUnpublishArgs = {
  id: Scalars['String']['input'];
};


export type MutationTemplateUpdateArgs = {
  id: Scalars['String']['input'];
  input: TemplateUpdateInput;
};


export type MutationTwoFactorInfoCreateArgs = {
  input: TwoFactorInfoCreateInput;
};


export type MutationTwoFactorInfoValidateArgs = {
  input: TwoFactorInfoValidateInput;
};


export type MutationUsageLimitRemoveArgs = {
  input: UsageLimitRemoveInput;
};


export type MutationUsageLimitSetArgs = {
  input: UsageLimitSetInput;
};


export type MutationUserFlagsRemoveArgs = {
  input: UserFlagsRemoveInput;
};


export type MutationUserFlagsSetArgs = {
  input: UserFlagsSetInput;
};


export type MutationUserUpdateArgs = {
  input: UserUpdateInput;
};


export type MutationVariableCollectionUpsertArgs = {
  input: VariableCollectionUpsertInput;
};


export type MutationVariableDeleteArgs = {
  input: VariableDeleteInput;
};


export type MutationVariableUpsertArgs = {
  input: VariableUpsertInput;
};


export type MutationVolumeCreateArgs = {
  input: VolumeCreateInput;
};


export type MutationVolumeDeleteArgs = {
  volumeId: Scalars['String']['input'];
};


export type MutationVolumeInstanceUpdateArgs = {
  environmentId?: InputMaybe<Scalars['String']['input']>;
  input: VolumeInstanceUpdateInput;
  volumeId: Scalars['String']['input'];
};


export type MutationVolumeUpdateArgs = {
  input: VolumeUpdateInput;
  volumeId: Scalars['String']['input'];
};


export type MutationWebhookCreateArgs = {
  input: WebhookCreateInput;
};


export type MutationWebhookDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationWebhookUpdateArgs = {
  id: Scalars['String']['input'];
  input: WebhookUpdateInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  card?: Maybe<PaymentMethodCard>;
  id: Scalars['String']['output'];
};

export type PaymentMethodCard = {
  __typename?: 'PaymentMethodCard';
  brand: Scalars['String']['output'];
  country?: Maybe<Scalars['String']['output']>;
  last4: Scalars['String']['output'];
};

export type PlatformStatus = {
  __typename?: 'PlatformStatus';
  incident?: Maybe<Incident>;
  isStable: Scalars['Boolean']['output'];
  maintenance?: Maybe<Maintenance>;
};

export type Plugin = Node & {
  __typename?: 'Plugin';
  containers: PluginContainersConnection;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  friendlyName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logsEnabled: Scalars['Boolean']['output'];
  name: PluginType;
  project: Project;
  status: PluginStatus;
  variables: PluginVariablesConnection;
};


export type PluginContainersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type PluginVariablesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type PluginContainersConnection = {
  __typename?: 'PluginContainersConnection';
  edges: Array<PluginContainersConnectionEdge>;
  pageInfo: PageInfo;
};

export type PluginContainersConnectionEdge = {
  __typename?: 'PluginContainersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Container;
};

export type PluginCreateInput = {
  environmentId?: InputMaybe<Scalars['String']['input']>;
  friendlyName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type PluginRestartInput = {
  environmentId: Scalars['String']['input'];
};

export enum PluginStatus {
  Locked = 'LOCKED',
  Removed = 'REMOVED',
  Running = 'RUNNING',
  Stopped = 'STOPPED'
}

export enum PluginType {
  Mongodb = 'mongodb',
  Mysql = 'mysql',
  Postgresql = 'postgresql',
  Redis = 'redis'
}

export type PluginUpdateInput = {
  friendlyName: Scalars['String']['input'];
};

export type PluginVariablesConnection = {
  __typename?: 'PluginVariablesConnection';
  edges: Array<PluginVariablesConnectionEdge>;
  pageInfo: PageInfo;
};

export type PluginVariablesConnectionEdge = {
  __typename?: 'PluginVariablesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Variable;
};

export type Preferences = Node & {
  __typename?: 'Preferences';
  buildFailedEmail: Scalars['Boolean']['output'];
  changelogEmail: Scalars['Boolean']['output'];
  deployCrashedEmail: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  marketingEmail: Scalars['Boolean']['output'];
  usageEmail: Scalars['Boolean']['output'];
};

export type PreferencesUpdateData = {
  buildFailedEmail?: InputMaybe<Scalars['Boolean']['input']>;
  changelogEmail?: InputMaybe<Scalars['Boolean']['input']>;
  deployCrashedEmail?: InputMaybe<Scalars['Boolean']['input']>;
  marketingEmail?: InputMaybe<Scalars['Boolean']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  usageEmail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PrivateNetwork = {
  __typename?: 'PrivateNetwork';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dnsName: Scalars['String']['output'];
  environmentId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  networkId: Scalars['BigInt']['output'];
  projectId: Scalars['String']['output'];
  publicId: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
};

export type PrivateNetworkCreateOrGetInput = {
  environmentId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
};

export type PrivateNetworkEndpoint = {
  __typename?: 'PrivateNetworkEndpoint';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dnsName: Scalars['String']['output'];
  privateIps: Array<Scalars['String']['output']>;
  publicId: Scalars['String']['output'];
  serviceInstanceId: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
};

export type PrivateNetworkEndpointCreateOrGetInput = {
  environmentId: Scalars['String']['input'];
  privateNetworkId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
  serviceName: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
};

export type Project = Node & {
  __typename?: 'Project';
  baseEnvironment?: Maybe<Environment>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  deploymentTriggers: ProjectDeploymentTriggersConnection;
  deployments: ProjectDeploymentsConnection;
  description?: Maybe<Scalars['String']['output']>;
  environments: ProjectEnvironmentsConnection;
  expiredAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  isTempProject: Scalars['Boolean']['output'];
  isUpdatable: Scalars['Boolean']['output'];
  members: Array<ProjectMember>;
  name: Scalars['String']['output'];
  plugins: ProjectPluginsConnection;
  prDeploys: Scalars['Boolean']['output'];
  prForks: Scalars['Boolean']['output'];
  projectPermissions: ProjectProjectPermissionsConnection;
  services: ProjectServicesConnection;
  subscriptionType: Scalars['String']['output'];
  team?: Maybe<Team>;
  teamId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  upstreamUrl?: Maybe<Scalars['String']['output']>;
  volumes: ProjectVolumesConnection;
  webhooks: ProjectWebhooksConnection;
};


export type ProjectDeploymentTriggersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ProjectDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ProjectEnvironmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ProjectPluginsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ProjectProjectPermissionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ProjectServicesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ProjectVolumesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ProjectWebhooksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ProjectCreateInput = {
  defaultEnvironmentName?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plugins?: InputMaybe<Array<Scalars['String']['input']>>;
  prDeploys?: InputMaybe<Scalars['Boolean']['input']>;
  repo?: InputMaybe<ProjectCreateRepo>;
  teamId?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectCreateRepo = {
  branch: Scalars['String']['input'];
  fullRepoName: Scalars['String']['input'];
};

export type ProjectDeploymentTriggersConnection = {
  __typename?: 'ProjectDeploymentTriggersConnection';
  edges: Array<ProjectDeploymentTriggersConnectionEdge>;
  pageInfo: PageInfo;
};

export type ProjectDeploymentTriggersConnectionEdge = {
  __typename?: 'ProjectDeploymentTriggersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: DeploymentTrigger;
};

export type ProjectDeploymentsConnection = {
  __typename?: 'ProjectDeploymentsConnection';
  edges: Array<ProjectDeploymentsConnectionEdge>;
  pageInfo: PageInfo;
};

export type ProjectDeploymentsConnectionEdge = {
  __typename?: 'ProjectDeploymentsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Deployment;
};

export type ProjectEnvironmentsConnection = {
  __typename?: 'ProjectEnvironmentsConnection';
  edges: Array<ProjectEnvironmentsConnectionEdge>;
  pageInfo: PageInfo;
};

export type ProjectEnvironmentsConnectionEdge = {
  __typename?: 'ProjectEnvironmentsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Environment;
};

export type ProjectInviteUserInput = {
  email: Scalars['String']['input'];
  link: Scalars['String']['input'];
};

export type ProjectMember = {
  __typename?: 'ProjectMember';
  avatar?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: ProjectRole;
};

export type ProjectMemberRemoveInput = {
  projectId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type ProjectMemberUpdateInput = {
  projectId: Scalars['String']['input'];
  role: ProjectRole;
  userId: Scalars['String']['input'];
};

export type ProjectPermission = Node & {
  __typename?: 'ProjectPermission';
  id: Scalars['ID']['output'];
  projectId: Scalars['String']['output'];
  role: ProjectRole;
  userId: Scalars['String']['output'];
};

export type ProjectPluginsConnection = {
  __typename?: 'ProjectPluginsConnection';
  edges: Array<ProjectPluginsConnectionEdge>;
  pageInfo: PageInfo;
};

export type ProjectPluginsConnectionEdge = {
  __typename?: 'ProjectPluginsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Plugin;
};

export type ProjectProjectPermissionsConnection = {
  __typename?: 'ProjectProjectPermissionsConnection';
  edges: Array<ProjectProjectPermissionsConnectionEdge>;
  pageInfo: PageInfo;
};

export type ProjectProjectPermissionsConnectionEdge = {
  __typename?: 'ProjectProjectPermissionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ProjectPermission;
};

export type ProjectResourceAccess = {
  __typename?: 'ProjectResourceAccess';
  customDomain: AccessRule;
  deployment: AccessRule;
  environment: AccessRule;
  plugin: AccessRule;
};

export enum ProjectRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Viewer = 'VIEWER'
}

export type ProjectServicesConnection = {
  __typename?: 'ProjectServicesConnection';
  edges: Array<ProjectServicesConnectionEdge>;
  pageInfo: PageInfo;
};

export type ProjectServicesConnectionEdge = {
  __typename?: 'ProjectServicesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Service;
};

export type ProjectToken = Node & {
  __typename?: 'ProjectToken';
  createdAt: Scalars['DateTime']['output'];
  displayToken: Scalars['String']['output'];
  environment: Environment;
  environmentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  project: Project;
  projectId: Scalars['String']['output'];
};

export type ProjectTokenCreateInput = {
  environmentId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type ProjectTransferConfirmInput = {
  ownershipTransferId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type ProjectTransferInitiateInput = {
  memberId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type ProjectTransferToTeamInput = {
  teamId: Scalars['String']['input'];
};

export type ProjectUpdateInput = {
  baseEnvironmentId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  prDeploys?: InputMaybe<Scalars['Boolean']['input']>;
  /** [Experimental] Will be deprecated eventually */
  prForks?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProjectVolumesConnection = {
  __typename?: 'ProjectVolumesConnection';
  edges: Array<ProjectVolumesConnectionEdge>;
  pageInfo: PageInfo;
};

export type ProjectVolumesConnectionEdge = {
  __typename?: 'ProjectVolumesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Volume;
};

export type ProjectWebhook = Node & {
  __typename?: 'ProjectWebhook';
  id: Scalars['ID']['output'];
  lastStatus?: Maybe<Scalars['Int']['output']>;
  projectId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ProjectWebhooksConnection = {
  __typename?: 'ProjectWebhooksConnection';
  edges: Array<ProjectWebhooksConnectionEdge>;
  pageInfo: PageInfo;
};

export type ProjectWebhooksConnectionEdge = {
  __typename?: 'ProjectWebhooksConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ProjectWebhook;
};

export type ProviderAuth = Node & {
  __typename?: 'ProviderAuth';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  metadata: Scalars['JSON']['output'];
  provider: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type PublicStats = {
  __typename?: 'PublicStats';
  totalDeployments: Scalars['Int']['output'];
  totalProjects: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Gets all API tokens for the authenticated user. */
  apiTokens: QueryApiTokensConnection;
  /** Fetch logs for a build */
  buildLogs: Array<Log>;
  /** Gets the image URL for a Notion image block */
  changelogBlockImage: Scalars['String']['output'];
  /** Gets the history of changesets for an environment. */
  changesets: QueryChangesetsConnection;
  /** Fetch details for a custom domain */
  customDomain: CustomDomain;
  /** Checks if a custom domain is available. */
  customDomainAvailable: DomainAvailable;
  /** Find a single deployment */
  deployment: Deployment;
  /** Fetch logs for a deployment */
  deploymentLogs: Array<Log>;
  /** All deployment triggers. */
  deploymentTriggers: QueryDeploymentTriggersConnection;
  /** Get all deployments */
  deployments: QueryDeploymentsConnection;
  /**
   * Domain with status
   * @deprecated Use the `status` field within the `domain` query instead
   */
  domainStatus: DomainWithStatus;
  /** All domains for a service instance */
  domains: AllDomains;
  /** Find a single environment */
  environment: Environment;
  /** Gets all environments for a project. */
  environments: QueryEnvironmentsConnection;
  /** Get the estimated total cost of the project at the end of the current billing cycle */
  estimatedUsage: Array<EstimatedUsage>;
  /** Gets the events for a project. */
  events: QueryEventsConnection;
  /** Check if a repo name is available */
  githubIsRepoNameAvailable: Scalars['Boolean']['output'];
  /** Get branches for a GitHub repo that the authenticated user has access to */
  githubRepoBranches: Array<GitHubBranch>;
  /** Get a list of repos for a user that Railway has access to */
  githubRepos: Array<GitHubRepo>;
  /** Get a list of scopes the user has installed the installation to */
  githubWritableScopes: Array<Scalars['String']['output']>;
  /** Get the Herokus apps for the current user */
  herokuApps: Array<HerokuApp>;
  /** Get an integration auth by provider providerId */
  integrationAuth: IntegrationAuth;
  /** Get all integration auths for a user */
  integrationAuths: QueryIntegrationAuthsConnection;
  /** Get all integrations for a project */
  integrations: QueryIntegrationsConnection;
  /** Get an invite code by the code */
  inviteCode: InviteCode;
  /** Gets the authenticated user. */
  me: User;
  /** Get metrics for a project, environment, and service */
  metrics: Array<MetricsResult>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  /** Get a user's Plain Customer ID given their Discord ID. */
  plainCustomerIdForDiscordId: Scalars['String']['output'];
  /** Get a user JWT token for a Discord id */
  plainJWTForDiscordId: Scalars['String']['output'];
  /** Get the current status of the platform */
  platformStatus: PlatformStatus;
  /** Get a plugin by ID. */
  plugin: Plugin;
  /** Fetch logs for a plugin */
  pluginLogs: Array<Log>;
  /** Get the email preferences for a user */
  preferences: Preferences;
  /** Get a private network endpoint for a service instance. */
  privateNetworkEndpoint?: Maybe<PrivateNetworkEndpoint>;
  /** Check if an endpoint name is available. */
  privateNetworkEndpointNameAvailable: Scalars['Boolean']['output'];
  /** List private networks for an environment. */
  privateNetworks: Array<PrivateNetwork>;
  /** Get a project by ID */
  project: Project;
  /** Get an invite code for a project for a specifc role */
  projectInviteCode: InviteCode;
  /** Gets users who belong to a project along with their role */
  projectMembers: Array<ProjectMember>;
  /** Get resource access rules for project-specific actions */
  projectResourceAccess: ProjectResourceAccess;
  /** Get a single project token by the value in the header */
  projectToken: ProjectToken;
  /** Get all project tokens for a project */
  projectTokens: QueryProjectTokensConnection;
  /** Gets all projects for a user or a team. */
  projects: QueryProjectsConnection;
  /** Get public Railway stats. Primarily used for the landing page. */
  publicStats: PublicStats;
  /** Gets the ReferralInfo for the authenticated user. */
  referralInfo: ReferralInfo;
  /** List available regions */
  regions: Array<Region>;
  /** Get resource access for the current user or team */
  resourceAccess: ResourceAccess;
  /** Get a service by ID */
  service: Service;
  /** Checks if a service domain is available */
  serviceDomainAvailable: DomainAvailable;
  /** Get a service instance belonging to a service and environment */
  serviceInstance: ServiceInstance;
  /** Check if the upstream repo for a service has an update available */
  serviceInstanceIsUpdatable: Scalars['Boolean']['output'];
  /** Gets all sessions for authenticated user. */
  sessions: QuerySessionsConnection;
  /** Find a team by ID */
  team: Team;
  /** Find a team by invite code */
  teamByCode: Team;
  /** Fetch Discord info associated with Direct Support-eligible team members, given a Discord UID */
  teamDirectSupportDiscordInfoForDiscordId?: Maybe<TeamDirectSupportDiscordInfo>;
  /** Get all templates for a team. */
  teamTemplates: QueryTeamTemplatesConnection;
  /** Get a template by code or GitHub owner and repo. */
  template: Template;
  /** Convert a Heroku template to a (legacy) Railway template config object. */
  templateFromHerokuTemplate: Scalars['JSON']['output'];
  /** Gets the README for a template. */
  templateReadme: TemplateReadme;
  /** Get the source template for a project. */
  templateSourceForProject?: Maybe<Template>;
  /** Get all published templates. */
  templates: QueryTemplatesConnection;
  /** Gets the TwoFactorInfo for the authenticated user. */
  twoFactorInfo: TwoFactorInfo;
  /** Get the usage for a single project or all projects for a user/team. If no `projectId` or `teamId` is provided, the usage for the current user is returned. */
  usage: Array<AggregatedUsage>;
  /** Get the user id corresponding to a Discord id */
  userIdForDiscordId: Scalars['String']['output'];
  /** Get all templates for the current user. */
  userTemplates: QueryUserTemplatesConnection;
  /** All variables by pluginId or serviceId. If neither are provided, all shared variables are returned. */
  variables: Scalars['ServiceVariables']['output'];
  /** All rendered variables that are required for a service deployment. */
  variablesForServiceDeployment: Scalars['ServiceVariables']['output'];
  /** Get information about the user's Vercel accounts */
  vercelInfo: VercelInfo;
  /** Get all webhooks for a project */
  webhooks: QueryWebhooksConnection;
  /** Gets the status of a workflow */
  workflowStatus: WorkflowResult;
};


export type QueryApiTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBuildLogsArgs = {
  deploymentId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryChangelogBlockImageArgs = {
  id: Scalars['String']['input'];
};


export type QueryChangesetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  environmentId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
};


export type QueryCustomDomainArgs = {
  id: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type QueryCustomDomainAvailableArgs = {
  domain: Scalars['String']['input'];
};


export type QueryDeploymentArgs = {
  id: Scalars['String']['input'];
};


export type QueryDeploymentLogsArgs = {
  deploymentId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryDeploymentTriggersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  environmentId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};


export type QueryDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  input: DeploymentListInput;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDomainStatusArgs = {
  id: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type QueryDomainsArgs = {
  environmentId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};


export type QueryEnvironmentArgs = {
  id: Scalars['String']['input'];
};


export type QueryEnvironmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isEphemeral?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
};


export type QueryEstimatedUsageArgs = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  measurements: Array<MetricMeasurement>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  environmentId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
};


export type QueryGithubIsRepoNameAvailableArgs = {
  fullRepoName: Scalars['String']['input'];
};


export type QueryGithubRepoBranchesArgs = {
  owner: Scalars['String']['input'];
  repo: Scalars['String']['input'];
};


export type QueryIntegrationAuthArgs = {
  provider: Scalars['String']['input'];
  providerId: Scalars['String']['input'];
};


export type QueryIntegrationAuthsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryIntegrationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
};


export type QueryInviteCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryMetricsArgs = {
  averagingWindowSeconds?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  environmentId?: InputMaybe<Scalars['String']['input']>;
  groupBy?: InputMaybe<Array<MetricTag>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  measurements: Array<MetricMeasurement>;
  pluginId?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  sampleRateSeconds?: InputMaybe<Scalars['Int']['input']>;
  serviceId?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  teamId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  volumeId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryPlainCustomerIdForDiscordIdArgs = {
  discordId: Scalars['String']['input'];
};


export type QueryPlainJwtForDiscordIdArgs = {
  discordId: Scalars['String']['input'];
};


export type QueryPluginArgs = {
  id: Scalars['String']['input'];
};


export type QueryPluginLogsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  environmentId: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  pluginId: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryPreferencesArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPrivateNetworkEndpointArgs = {
  environmentId: Scalars['String']['input'];
  privateNetworkId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};


export type QueryPrivateNetworkEndpointNameAvailableArgs = {
  environmentId: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
  privateNetworkId: Scalars['String']['input'];
};


export type QueryPrivateNetworksArgs = {
  environmentId: Scalars['String']['input'];
};


export type QueryProjectArgs = {
  id: Scalars['String']['input'];
};


export type QueryProjectInviteCodeArgs = {
  projectId: Scalars['String']['input'];
  role: ProjectRole;
};


export type QueryProjectMembersArgs = {
  projectId: Scalars['String']['input'];
};


export type QueryProjectResourceAccessArgs = {
  projectId: Scalars['String']['input'];
};


export type QueryProjectTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
};


export type QueryProjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryResourceAccessArgs = {
  explicitResourceOwner?: InputMaybe<ExplicitOwnerInput>;
};


export type QueryServiceArgs = {
  id: Scalars['String']['input'];
};


export type QueryServiceDomainAvailableArgs = {
  domain: Scalars['String']['input'];
};


export type QueryServiceInstanceArgs = {
  environmentId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};


export type QueryServiceInstanceIsUpdatableArgs = {
  environmentId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};


export type QuerySessionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTeamArgs = {
  id: Scalars['String']['input'];
};


export type QueryTeamByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryTeamDirectSupportDiscordInfoForDiscordIdArgs = {
  discordId: Scalars['String']['input'];
};


export type QueryTeamTemplatesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  teamId: Scalars['String']['input'];
};


export type QueryTemplateArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  repo?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTemplateFromHerokuTemplateArgs = {
  repoUrl: Scalars['String']['input'];
};


export type QueryTemplateReadmeArgs = {
  code: Scalars['String']['input'];
};


export type QueryTemplateSourceForProjectArgs = {
  projectId: Scalars['String']['input'];
};


export type QueryTemplatesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  recommended?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryUsageArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  groupBy?: InputMaybe<Array<MetricTag>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  measurements: Array<MetricMeasurement>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserIdForDiscordIdArgs = {
  discordId: Scalars['String']['input'];
};


export type QueryUserTemplatesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryVariablesArgs = {
  environmentId: Scalars['String']['input'];
  pluginId?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['String']['input'];
  serviceId?: InputMaybe<Scalars['String']['input']>;
  unrendered?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryVariablesForServiceDeploymentArgs = {
  environmentId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};


export type QueryWebhooksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
};


export type QueryWorkflowStatusArgs = {
  projectId?: InputMaybe<Scalars['String']['input']>;
  workflowId: Scalars['String']['input'];
};

export type QueryApiTokensConnection = {
  __typename?: 'QueryApiTokensConnection';
  edges: Array<QueryApiTokensConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryApiTokensConnectionEdge = {
  __typename?: 'QueryApiTokensConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ApiToken;
};

export type QueryChangesetsConnection = {
  __typename?: 'QueryChangesetsConnection';
  edges: Array<QueryChangesetsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryChangesetsConnectionEdge = {
  __typename?: 'QueryChangesetsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Changeset;
};

export type QueryDeploymentTriggersConnection = {
  __typename?: 'QueryDeploymentTriggersConnection';
  edges: Array<QueryDeploymentTriggersConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryDeploymentTriggersConnectionEdge = {
  __typename?: 'QueryDeploymentTriggersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: DeploymentTrigger;
};

export type QueryDeploymentsConnection = {
  __typename?: 'QueryDeploymentsConnection';
  edges: Array<QueryDeploymentsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryDeploymentsConnectionEdge = {
  __typename?: 'QueryDeploymentsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Deployment;
};

export type QueryEnvironmentsConnection = {
  __typename?: 'QueryEnvironmentsConnection';
  edges: Array<QueryEnvironmentsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryEnvironmentsConnectionEdge = {
  __typename?: 'QueryEnvironmentsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Environment;
};

export type QueryEventsConnection = {
  __typename?: 'QueryEventsConnection';
  edges: Array<QueryEventsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryEventsConnectionEdge = {
  __typename?: 'QueryEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export type QueryIntegrationAuthsConnection = {
  __typename?: 'QueryIntegrationAuthsConnection';
  edges: Array<QueryIntegrationAuthsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryIntegrationAuthsConnectionEdge = {
  __typename?: 'QueryIntegrationAuthsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: IntegrationAuth;
};

export type QueryIntegrationsConnection = {
  __typename?: 'QueryIntegrationsConnection';
  edges: Array<QueryIntegrationsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryIntegrationsConnectionEdge = {
  __typename?: 'QueryIntegrationsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Integration;
};

export type QueryProjectTokensConnection = {
  __typename?: 'QueryProjectTokensConnection';
  edges: Array<QueryProjectTokensConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryProjectTokensConnectionEdge = {
  __typename?: 'QueryProjectTokensConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ProjectToken;
};

export type QueryProjectsConnection = {
  __typename?: 'QueryProjectsConnection';
  edges: Array<QueryProjectsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryProjectsConnectionEdge = {
  __typename?: 'QueryProjectsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Project;
};

export type QuerySessionsConnection = {
  __typename?: 'QuerySessionsConnection';
  edges: Array<QuerySessionsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QuerySessionsConnectionEdge = {
  __typename?: 'QuerySessionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Session;
};

export type QueryTeamTemplatesConnection = {
  __typename?: 'QueryTeamTemplatesConnection';
  edges: Array<QueryTeamTemplatesConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryTeamTemplatesConnectionEdge = {
  __typename?: 'QueryTeamTemplatesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Template;
};

export type QueryTemplatesConnection = {
  __typename?: 'QueryTemplatesConnection';
  edges: Array<QueryTemplatesConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryTemplatesConnectionEdge = {
  __typename?: 'QueryTemplatesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Template;
};

export type QueryUserTemplatesConnection = {
  __typename?: 'QueryUserTemplatesConnection';
  edges: Array<QueryUserTemplatesConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryUserTemplatesConnectionEdge = {
  __typename?: 'QueryUserTemplatesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Template;
};

export type QueryWebhooksConnection = {
  __typename?: 'QueryWebhooksConnection';
  edges: Array<QueryWebhooksConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryWebhooksConnectionEdge = {
  __typename?: 'QueryWebhooksConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ProjectWebhook;
};

export type RecoveryCodeValidateInput = {
  code: Scalars['String']['input'];
  twoFactorLinkingKey?: InputMaybe<Scalars['String']['input']>;
};

export type RecoveryCodes = {
  __typename?: 'RecoveryCodes';
  recoveryCodes: Array<Scalars['String']['output']>;
};

export type ReferralInfo = Node & {
  __typename?: 'ReferralInfo';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  referralStats: ReferralStats;
  status: Scalars['String']['output'];
};

export type ReferralInfoUpdateInput = {
  code: Scalars['String']['input'];
};

export type ReferralStats = {
  __typename?: 'ReferralStats';
  credited: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
};

export enum ReferralStatus {
  RefereeCredited = 'REFEREE_CREDITED',
  ReferrerCredited = 'REFERRER_CREDITED',
  Registered = 'REGISTERED'
}

export type ReferralUser = {
  __typename?: 'ReferralUser';
  code: Scalars['String']['output'];
  id: Scalars['String']['output'];
  status: ReferralStatus;
};

export type Region = {
  __typename?: 'Region';
  name: Scalars['String']['output'];
};

export enum RegistrationStatus {
  Onboarded = 'ONBOARDED',
  Registered = 'REGISTERED',
  Waitlisted = 'WAITLISTED'
}

export type ResetPluginCredentialsInput = {
  environmentId: Scalars['String']['input'];
};

export type ResetPluginInput = {
  environmentId: Scalars['String']['input'];
};

export type ResourceAccess = {
  __typename?: 'ResourceAccess';
  project: AccessRule;
};

export enum ResourceOwnerType {
  Team = 'TEAM',
  User = 'USER'
}

export enum RestartPolicyType {
  Always = 'ALWAYS',
  Never = 'NEVER',
  OnFailure = 'ON_FAILURE'
}

export type Service = Node & {
  __typename?: 'Service';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  deployments: ServiceDeploymentsConnection;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  project: Project;
  projectId: Scalars['String']['output'];
  repoTriggers: ServiceRepoTriggersConnection;
  serviceInstances: ServiceServiceInstancesConnection;
  updatedAt: Scalars['DateTime']['output'];
};


export type ServiceDeploymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ServiceRepoTriggersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ServiceServiceInstancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ServiceConnectInput = {
  /** The branch to connect to. e.g. 'main' */
  branch?: InputMaybe<Scalars['String']['input']>;
  /** The full name of the repo to connect to. e.g. 'railwayapp/starters' */
  repo?: InputMaybe<Scalars['String']['input']>;
};

export type ServiceCreateInput = {
  branch?: InputMaybe<Scalars['String']['input']>;
  /** [Experimental] Environment ID. If the specified environment is a fork, the service will only be created in it. Otherwise it will created in all environments that are not forks of other environments */
  environmentId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['String']['input'];
  source?: InputMaybe<ServiceSourceInput>;
  variables?: InputMaybe<Scalars['ServiceVariables']['input']>;
};

export type ServiceDeploymentsConnection = {
  __typename?: 'ServiceDeploymentsConnection';
  edges: Array<ServiceDeploymentsConnectionEdge>;
  pageInfo: PageInfo;
};

export type ServiceDeploymentsConnectionEdge = {
  __typename?: 'ServiceDeploymentsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Deployment;
};

export type ServiceDomain = Domain & {
  __typename?: 'ServiceDomain';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  domain: Scalars['String']['output'];
  environmentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  serviceId: Scalars['String']['output'];
  suffix?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ServiceDomainCreateInput = {
  environmentId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};

export type ServiceDomainUpdateInput = {
  domain: Scalars['String']['input'];
  environmentId: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
};

export type ServiceInstance = Node & {
  __typename?: 'ServiceInstance';
  buildCommand?: Maybe<Scalars['String']['output']>;
  builder: Builder;
  createdAt: Scalars['DateTime']['output'];
  cronSchedule?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  domains: AllDomains;
  environmentId: Scalars['String']['output'];
  healthcheckPath?: Maybe<Scalars['String']['output']>;
  healthcheckTimeout?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isUpdatable: Scalars['Boolean']['output'];
  nextCronRunAt?: Maybe<Scalars['DateTime']['output']>;
  nixpacksPlan?: Maybe<Scalars['JSON']['output']>;
  railwayConfigFile?: Maybe<Scalars['String']['output']>;
  restartPolicyMaxRetries: Scalars['Int']['output'];
  restartPolicyType: RestartPolicyType;
  rootDirectory?: Maybe<Scalars['String']['output']>;
  serviceId: Scalars['String']['output'];
  source?: Maybe<ServiceSource>;
  startCommand?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  upstreamUrl?: Maybe<Scalars['String']['output']>;
  watchPatterns: Array<Scalars['String']['output']>;
};

export type ServiceInstanceUpdateInput = {
  buildCommand?: InputMaybe<Scalars['String']['input']>;
  builder?: InputMaybe<Builder>;
  cronSchedule?: InputMaybe<Scalars['String']['input']>;
  healthcheckPath?: InputMaybe<Scalars['String']['input']>;
  healthcheckTimeout?: InputMaybe<Scalars['Int']['input']>;
  nixpacksPlan?: InputMaybe<Scalars['JSON']['input']>;
  railwayConfigFile?: InputMaybe<Scalars['String']['input']>;
  restartPolicyMaxRetries?: InputMaybe<Scalars['Int']['input']>;
  restartPolicyType?: InputMaybe<RestartPolicyType>;
  rootDirectory?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<ServiceSourceInput>;
  startCommand?: InputMaybe<Scalars['String']['input']>;
  watchPatterns?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ServiceRepoTriggersConnection = {
  __typename?: 'ServiceRepoTriggersConnection';
  edges: Array<ServiceRepoTriggersConnectionEdge>;
  pageInfo: PageInfo;
};

export type ServiceRepoTriggersConnectionEdge = {
  __typename?: 'ServiceRepoTriggersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: DeploymentTrigger;
};

export type ServiceServiceInstancesConnection = {
  __typename?: 'ServiceServiceInstancesConnection';
  edges: Array<ServiceServiceInstancesConnectionEdge>;
  pageInfo: PageInfo;
};

export type ServiceServiceInstancesConnectionEdge = {
  __typename?: 'ServiceServiceInstancesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ServiceInstance;
};

export type ServiceSource = {
  __typename?: 'ServiceSource';
  image?: Maybe<Scalars['String']['output']>;
  repo?: Maybe<Scalars['String']['output']>;
  template?: Maybe<TemplateServiceSource>;
};

export type ServiceSourceInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  repo?: InputMaybe<Scalars['String']['input']>;
};

export type ServiceUpdateInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Session = Node & {
  __typename?: 'Session';
  createdAt: Scalars['DateTime']['output'];
  expiredAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isCurrent: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  type: SessionType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum SessionType {
  Browser = 'BROWSER',
  Cli = 'CLI'
}

export type SharedVariableConfigureInput = {
  disabledServiceIds: Array<Scalars['String']['input']>;
  enabledServiceIds: Array<Scalars['String']['input']>;
  environmentId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type SimilarTemplate = {
  __typename?: 'SimilarTemplate';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<TemplateCreator>;
  deploys: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  teamId?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Stream logs for a build */
  buildLogs: Array<Log>;
  /** Stream logs for a deployment */
  deploymentLogs: Array<Log>;
  /** Stream logs for a plugin */
  pluginLogs: Array<Log>;
};


export type SubscriptionBuildLogsArgs = {
  deploymentId: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type SubscriptionDeploymentLogsArgs = {
  deploymentId: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type SubscriptionPluginLogsArgs = {
  environmentId: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  pluginId: Scalars['String']['input'];
};

export type SubscriptionDiscount = {
  __typename?: 'SubscriptionDiscount';
  couponId: Scalars['String']['output'];
};

export type SubscriptionItem = {
  __typename?: 'SubscriptionItem';
  itemId: Scalars['String']['output'];
  priceId: Scalars['String']['output'];
  productId: Scalars['String']['output'];
  quantity?: Maybe<Scalars['BigInt']['output']>;
};

export enum SubscriptionState {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Inactive = 'INACTIVE',
  PastDue = 'PAST_DUE',
  Unpaid = 'UNPAID'
}

export type Team = Node & {
  __typename?: 'Team';
  avatar?: Maybe<Scalars['String']['output']>;
  banReason?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer: Customer;
  discordRole?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isEligibleForDirectSupport: Scalars['Boolean']['output'];
  members: Array<TeamMember>;
  name: Scalars['String']['output'];
  projects: TeamProjectsConnection;
  teamPermissions: Array<TeamPermission>;
  updatedAt: Scalars['DateTime']['output'];
};


export type TeamProjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type TeamBulkProjectTransferInput = {
  projectIds: Array<Scalars['String']['input']>;
  teamId: Scalars['String']['input'];
};

export type TeamCreateAndSubscribeInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  paymentMethodId: Scalars['String']['input'];
};

export type TeamCreateAndSubscribeResponse = {
  __typename?: 'TeamCreateAndSubscribeResponse';
  customerId: Scalars['String']['output'];
  paymentIntent?: Maybe<Scalars['JSON']['output']>;
  teamId: Scalars['String']['output'];
};

export type TeamCreateInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type TeamDirectSupportDiscordInfo = {
  __typename?: 'TeamDirectSupportDiscordInfo';
  memberDiscordIds: Array<Scalars['String']['output']>;
  teamId: Scalars['String']['output'];
  teamName: Scalars['String']['output'];
};

export type TeamInviteCodeCreateInput = {
  role: Scalars['String']['input'];
};

export type TeamMember = {
  __typename?: 'TeamMember';
  avatar?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: TeamRole;
};

export type TeamPermission = Node & {
  __typename?: 'TeamPermission';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  role: TeamRole;
  teamId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type TeamPermissionChangeInput = {
  role: TeamRole;
  teamId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type TeamProjectsConnection = {
  __typename?: 'TeamProjectsConnection';
  edges: Array<TeamProjectsConnectionEdge>;
  pageInfo: PageInfo;
};

export type TeamProjectsConnectionEdge = {
  __typename?: 'TeamProjectsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Project;
};

export enum TeamRole {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}

export type TeamUpdateInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type TeamUserInviteInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type TeamUserRemoveInput = {
  userId: Scalars['String']['input'];
};

export type TelemetrySendInput = {
  command: Scalars['String']['input'];
  environmentId?: InputMaybe<Scalars['String']['input']>;
  error: Scalars['String']['input'];
  projectId?: InputMaybe<Scalars['String']['input']>;
  stacktrace: Scalars['String']['input'];
  version?: InputMaybe<Scalars['String']['input']>;
};

export type Template = Node & {
  __typename?: 'Template';
  activeProjects: Scalars['Int']['output'];
  code: Scalars['String']['output'];
  config: Scalars['TemplateConfig']['output'];
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<TemplateCreator>;
  demoProjectId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isApproved: Scalars['Boolean']['output'];
  metadata: Scalars['TemplateMetadata']['output'];
  projects: Scalars['Int']['output'];
  services: TemplateServicesConnection;
  similarTemplates: Array<SimilarTemplate>;
  status: TemplateStatus;
  teamId?: Maybe<Scalars['String']['output']>;
  totalPayout: Scalars['Int']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};


export type TemplateServicesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type TemplateCreateInput = {
  config: Scalars['TemplateConfig']['input'];
  demoProjectId?: InputMaybe<Scalars['String']['input']>;
  metadata: Scalars['TemplateMetadata']['input'];
  services: Array<TemplateServiceCreateInput>;
  teamId?: InputMaybe<Scalars['String']['input']>;
};

export type TemplateCreator = {
  __typename?: 'TemplateCreator';
  avatar?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type TemplateDeployInput = {
  plugins?: InputMaybe<Array<Scalars['String']['input']>>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  services: Array<TemplateDeployService>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  templateCode?: InputMaybe<Scalars['String']['input']>;
};

export type TemplateDeployPayload = {
  __typename?: 'TemplateDeployPayload';
  projectId: Scalars['String']['output'];
  workflowId?: Maybe<Scalars['String']['output']>;
};

export type TemplateDeployService = {
  commit?: InputMaybe<Scalars['String']['input']>;
  hasDomain?: InputMaybe<Scalars['Boolean']['input']>;
  healthcheckPath?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  rootDirectory?: InputMaybe<Scalars['String']['input']>;
  serviceIcon?: InputMaybe<Scalars['String']['input']>;
  serviceName: Scalars['String']['input'];
  startCommand?: InputMaybe<Scalars['String']['input']>;
  tcpProxyApplicationPort?: InputMaybe<Scalars['Int']['input']>;
  template: Scalars['String']['input'];
  variables?: InputMaybe<Scalars['ServiceVariables']['input']>;
  volumes?: InputMaybe<Array<Scalars['TemplateVolume']['input']>>;
};

export type TemplateGenerateInput = {
  projectId: Scalars['String']['input'];
};

export type TemplatePublishInput = {
  category: Scalars['String']['input'];
  description: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  readme: Scalars['String']['input'];
  teamId?: InputMaybe<Scalars['String']['input']>;
};

export type TemplateReadme = {
  __typename?: 'TemplateReadme';
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  readmeContent: Scalars['String']['output'];
};

export type TemplateService = Node & {
  __typename?: 'TemplateService';
  config: Scalars['TemplateServiceConfig']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  templateId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TemplateServiceCreateInput = {
  config: Scalars['TemplateServiceConfig']['input'];
};

export type TemplateServiceSource = {
  __typename?: 'TemplateServiceSource';
  serviceName: Scalars['String']['output'];
  serviceSource: Scalars['String']['output'];
};

export type TemplateServiceUpdateInput = {
  config: Scalars['TemplateServiceConfig']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
};

export type TemplateServicesConnection = {
  __typename?: 'TemplateServicesConnection';
  edges: Array<TemplateServicesConnectionEdge>;
  pageInfo: PageInfo;
};

export type TemplateServicesConnectionEdge = {
  __typename?: 'TemplateServicesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: TemplateService;
};

export enum TemplateStatus {
  Hidden = 'HIDDEN',
  Published = 'PUBLISHED',
  Unpublished = 'UNPUBLISHED'
}

export type TemplateUpdateInput = {
  config: Scalars['TemplateConfig']['input'];
  demoProjectId?: InputMaybe<Scalars['String']['input']>;
  /** An admin-only flag to force-update a template. */
  forceUpdate?: InputMaybe<Scalars['Boolean']['input']>;
  metadata: Scalars['TemplateMetadata']['input'];
  services: Array<TemplateServiceUpdateInput>;
  teamId?: InputMaybe<Scalars['String']['input']>;
};

export type TwoFactorInfo = {
  __typename?: 'TwoFactorInfo';
  hasRecoveryCodes: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
};

export type TwoFactorInfoCreateInput = {
  token: Scalars['String']['input'];
};

export type TwoFactorInfoSecret = {
  __typename?: 'TwoFactorInfoSecret';
  secret: Scalars['String']['output'];
  uri: Scalars['String']['output'];
};

export type TwoFactorInfoValidateInput = {
  token: Scalars['String']['input'];
  twoFactorLinkingKey?: InputMaybe<Scalars['String']['input']>;
};

export type UsageAnomaly = Node & {
  __typename?: 'UsageAnomaly';
  actedOn?: Maybe<Scalars['DateTime']['output']>;
  action?: Maybe<UsageAnomalyAction>;
  actorId?: Maybe<Scalars['String']['output']>;
  flaggedAt: Scalars['DateTime']['output'];
  flaggedFor: UsageAnomalyFlagReason;
  id: Scalars['ID']['output'];
};

/** Possible actions for a UsageAnomaly. */
export enum UsageAnomalyAction {
  Allowed = 'ALLOWED',
  Autobanned = 'AUTOBANNED',
  Banned = 'BANNED'
}

/** Possible flag reasons for a UsageAnomaly. */
export enum UsageAnomalyFlagReason {
  HighCpuUsage = 'HIGH_CPU_USAGE',
  HighDiskUsage = 'HIGH_DISK_USAGE',
  HighNetworkUsage = 'HIGH_NETWORK_USAGE'
}

export type UsageLimit = Node & {
  __typename?: 'UsageLimit';
  customerId: Scalars['String']['output'];
  hardLimit?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  softLimit: Scalars['Int']['output'];
};

export type UsageLimitRemoveInput = {
  customerId: Scalars['String']['input'];
};

export type UsageLimitSetInput = {
  customerId: Scalars['String']['input'];
  hardLimitDollars?: InputMaybe<Scalars['Int']['input']>;
  softLimitDollars: Scalars['Int']['input'];
};

export type User = Node & {
  __typename?: 'User';
  agreedFairUse: Scalars['Boolean']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  banReason?: Maybe<Scalars['String']['output']>;
  cost: UserCost;
  createdAt: Scalars['DateTime']['output'];
  customer: Customer;
  email: Scalars['String']['output'];
  flags: Array<UserFlag>;
  has2FA: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isDevPlan: Scalars['Boolean']['output'];
  isEligibleForFreeHobbyPlan: Scalars['Boolean']['output'];
  isOnHobbyPlan: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastLogin: Scalars['DateTime']['output'];
  name?: Maybe<Scalars['String']['output']>;
  projects: UserProjectsConnection;
  providerAuths: UserProviderAuthsConnection;
  referredUsers: Array<ReferralUser>;
  registrationStatus: RegistrationStatus;
  riskLevel?: Maybe<Scalars['Float']['output']>;
  teams: UserTeamsConnection;
  termsAgreedOn?: Maybe<Scalars['DateTime']['output']>;
};


export type UserProjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type UserProviderAuthsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type UserTeamsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type UserCost = {
  __typename?: 'UserCost';
  current: Scalars['Float']['output'];
  estimated: Scalars['Float']['output'];
};

export enum UserFlag {
  Beta = 'BETA',
  PricingPreview = 'PRICING_PREVIEW'
}

export type UserFlagsRemoveInput = {
  flags: Array<UserFlag>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UserFlagsSetInput = {
  flags: Array<UserFlag>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UserProjectsConnection = {
  __typename?: 'UserProjectsConnection';
  edges: Array<UserProjectsConnectionEdge>;
  pageInfo: PageInfo;
};

export type UserProjectsConnectionEdge = {
  __typename?: 'UserProjectsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Project;
};

export type UserProviderAuthsConnection = {
  __typename?: 'UserProviderAuthsConnection';
  edges: Array<UserProviderAuthsConnectionEdge>;
  pageInfo: PageInfo;
};

export type UserProviderAuthsConnectionEdge = {
  __typename?: 'UserProviderAuthsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ProviderAuth;
};

export type UserTeamsConnection = {
  __typename?: 'UserTeamsConnection';
  edges: Array<UserTeamsConnectionEdge>;
  pageInfo: PageInfo;
};

export type UserTeamsConnectionEdge = {
  __typename?: 'UserTeamsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Team;
};

export type UserUpdateInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Variable = Node & {
  __typename?: 'Variable';
  createdAt: Scalars['DateTime']['output'];
  environment: Environment;
  environmentId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  plugin: Plugin;
  pluginId?: Maybe<Scalars['String']['output']>;
  references: Array<Scalars['String']['output']>;
  service: Service;
  serviceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type VariableCollectionUpsertInput = {
  environmentId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  /** When set to true, removes all existing variables before upserting the new collection. */
  replace?: InputMaybe<Scalars['Boolean']['input']>;
  serviceId?: InputMaybe<Scalars['String']['input']>;
  variables: Scalars['ServiceVariables']['input'];
};

export type VariableDeleteInput = {
  environmentId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  serviceId?: InputMaybe<Scalars['String']['input']>;
};

export type VariableUpsertInput = {
  environmentId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  serviceId?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
};

export type VercelAccount = {
  __typename?: 'VercelAccount';
  id: Scalars['String']['output'];
  integrationAuthId: Scalars['String']['output'];
  isUser: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  projects: Array<VercelProject>;
  slug?: Maybe<Scalars['String']['output']>;
};

export type VercelInfo = {
  __typename?: 'VercelInfo';
  accounts: Array<VercelAccount>;
};

export type VercelProject = {
  __typename?: 'VercelProject';
  accountId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Volume = Node & {
  __typename?: 'Volume';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  project: Project;
  projectId: Scalars['String']['output'];
  volumeInstances: VolumeVolumeInstancesConnection;
};


export type VolumeVolumeInstancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type VolumeCreateInput = {
  /** The path in the container to mount the volume to */
  mountPath: Scalars['String']['input'];
  /** The project to create the volume in */
  projectId: Scalars['String']['input'];
  /** The service to attach the volume to. If not provided, the volume will be disconnected. */
  serviceId?: InputMaybe<Scalars['String']['input']>;
};

export type VolumeInstance = Node & {
  __typename?: 'VolumeInstance';
  createdAt: Scalars['DateTime']['output'];
  currentSizeMB: Scalars['Float']['output'];
  environment: Environment;
  environmentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mountPath: Scalars['String']['output'];
  region?: Maybe<Scalars['String']['output']>;
  service: Service;
  serviceId?: Maybe<Scalars['String']['output']>;
  sizeMB: Scalars['Int']['output'];
  state?: Maybe<Scalars['String']['output']>;
  volume: Volume;
  volumeId: Scalars['String']['output'];
};

export type VolumeInstanceUpdateInput = {
  /** The mount path of the volume instance. If not provided, the mount path will not be updated. */
  mountPath?: InputMaybe<Scalars['String']['input']>;
  /** The service to attach the volume to. If not provided, the volume will be disconnected. */
  serviceId?: InputMaybe<Scalars['String']['input']>;
};

export type VolumeUpdateInput = {
  /** The name of the volume */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type VolumeVolumeInstancesConnection = {
  __typename?: 'VolumeVolumeInstancesConnection';
  edges: Array<VolumeVolumeInstancesConnectionEdge>;
  pageInfo: PageInfo;
};

export type VolumeVolumeInstancesConnectionEdge = {
  __typename?: 'VolumeVolumeInstancesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: VolumeInstance;
};

export type WebhookCreateInput = {
  projectId: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type WebhookUpdateInput = {
  url: Scalars['String']['input'];
};

export type WorkflowResult = {
  __typename?: 'WorkflowResult';
  status: WorkflowStatus;
};

export enum WorkflowStatus {
  Complete = 'Complete',
  Error = 'Error',
  Running = 'Running'
}

export type LatestDeploymentQueryVariables = Exact<{
  input: DeploymentListInput;
  first: Scalars['Int']['input'];
}>;


export type LatestDeploymentQuery = { __typename?: 'Query', deployments: { __typename?: 'QueryDeploymentsConnection', edges: Array<{ __typename?: 'QueryDeploymentsConnectionEdge', node: { __typename?: 'Deployment', id: string, createdAt: string, status: DeploymentStatus } }> } };

export type RemoveDeploymentMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveDeploymentMutation = { __typename?: 'Mutation', deploymentRemove: boolean };

export type RestartDeploymentMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RestartDeploymentMutation = { __typename?: 'Mutation', deploymentRedeploy: { __typename?: 'Deployment', id: string } };

export type StreamDeploymentLogsSubscriptionVariables = Exact<{
  deploymentId: Scalars['String']['input'];
}>;


export type StreamDeploymentLogsSubscription = { __typename?: 'Subscription', deploymentLogs: Array<{ __typename?: 'Log', message: string, timestamp: string }> };


export const LatestDeploymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LatestDeployment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeploymentListInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deployments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LatestDeploymentQuery, LatestDeploymentQueryVariables>;
export const RemoveDeploymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveDeployment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deploymentRemove"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveDeploymentMutation, RemoveDeploymentMutationVariables>;
export const RestartDeploymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestartDeployment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deploymentRedeploy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RestartDeploymentMutation, RestartDeploymentMutationVariables>;
export const StreamDeploymentLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"StreamDeploymentLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deploymentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deploymentLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deploymentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deploymentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<StreamDeploymentLogsSubscription, StreamDeploymentLogsSubscriptionVariables>;