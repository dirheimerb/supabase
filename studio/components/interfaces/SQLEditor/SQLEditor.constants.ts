import { SQLTemplate } from './SQLEditor.types'

export const SQL_TEMPLATES: SQLTemplate[] = [
  {
    id: 1,
    type: 'template',
    title: 'Create table',
    description: 'Basic table template. Change "table_name" to the name you prefer.',
    sql: `create table table_name (
  id bigint generated by default as identity primary key,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  data jsonb,
  name text
);`,
  },
  {
    id: 2,
    type: 'template',
    title: 'Add column',
    description: 'Template to add a column. Make sure to change the name and type.',
    sql: `alter table table_name
add column new_column_name data_type;`,
  },
  {
    id: 3,
    type: 'template',
    title: 'Add comments',
    description: 'Templates to add a comment to either a table or a column.',
    sql: `comment on table table_name is 'Table description';
comment on column table_name.column_name is 'Column description';`,
  },
  {
    id: 4,
    type: 'template',
    title: 'Show extensions',
    description: 'Get a list of extensions in your database and status.',
    sql: `select
  name, comment, default_version, installed_version
from
  pg_available_extensions
order by
  name asc;`,
  },
  {
    id: 5,
    type: 'template',
    title: 'Show version',
    description: 'Get your Postgres version.',
    sql: `select * from
  (select version()) as version,
  (select current_setting('server_version_num')) as version_number;`,
  },
  {
    id: 6,
    type: 'template',
    title: 'Show active connections',
    description: 'Get the number of active and max connections.',
    sql: `select * from
(select count(pid) as active_connections FROM pg_stat_activity where state = 'active') active_connections,
(select setting as max_connections from pg_settings where name = 'max_connections') max_connections;`,
  },
  {
    id: 7,
    type: 'template',
    title: 'Automatically update timestamps',
    description: 'Update a column timestamp on every update.',
    sql: `
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "todos", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
create trigger
  handle_updated_at before update
on todos
for each row execute
  procedure moddatetime(updated_at);
  `.trim(),
  },
  {
    id: 8,
    type: 'template',
    title: 'Increment field value',
    description: 'Update a field with incrementing value using stored procedure.',
    sql: `
create function increment(row_id int)
returns void as
$$
  update table_name
  set field_name = field_name + 1
  where id = row_id;
$$
language sql volatile;

-- you can call the function from your browser with supabase-js
-- const { data, error } = await supabase.rpc('increment', { row_id: 2 })
  `.trim(),
  },
  {
    id: 8,
    type: 'template',
    title: 'pg_stat_statements report',
    description: 'Select from pg_stat_statements and view recent queries',
    sql: `-- pg_stat_statements report

-- A limit of 100 has been added below

select
    auth.rolname,
    statements.query,
    statements.calls,
    -- -- Postgres 13, 14
    statements.total_exec_time + statements.total_plan_time as total_time,
    statements.min_exec_time + statements.min_plan_time as min_time,
    statements.max_exec_time + statements.max_plan_time as max_time,
    statements.mean_exec_time + statements.mean_plan_time as mean_time,
    -- -- Postgres <= 12
    -- total_time,
    -- min_time,
    -- max_time,
    -- mean_time,
    statements.rows / statements.calls as avg_rows,
    statements.wal_bytes,
    statements.wal_records
  from pg_stat_statements as statements
    inner join pg_authid as auth on statements.userid = auth.oid
  order by
    total_time desc
  limit
    100;`,
  },
  {
    id: 9,
    type: 'quickstart',
    title: 'Countries',
    description: 'Create a table with all the countries in the world.',
    sql: `create type public.continents as enum (
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'Oceania',
    'North America',
    'South America'
);
create table public.countries (
  id bigint generated by default as identity primary key,
  name text,
  iso2 text not null,
  iso3 text,
  local_name text,
  continent continents
);
comment on table countries is 'Full list of countries.';
comment on column countries.name is 'Full country name.';
comment on column countries.iso2 is 'ISO 3166-1 alpha-2 code.';
comment on column countries.iso3 is 'ISO 3166-1 alpha-3 code.';
comment on column countries.local_name is 'Local variation of the name.';
insert into public.countries (name,iso2,iso3,local_name,continent) values
  ('Bonaire, Sint Eustatius and Saba','BQ','BES',null,null),
  ('Curaçao','CW','CUW',null,null),
  ('Guernsey','GG','GGY',null,null),
  ('Isle of Man','IM','IMN',null,null),
  ('Jersey','JE','JEY',null,null),
  ('Åland Islands','AX','ALA',null,null),
  ('Montenegro','ME','MNE',null,null),
  ('Saint Barthélemy','BL','BLM',null,null),
  ('Saint Martin (French part)','MF','MAF',null,null),
  ('Serbia','RS','SRB',null,null),
  ('Sint Maarten (Dutch part)','SX','SXM',null,null),
  ('South Sudan','SS','SSD',null,null),
  ('Timor-Leste','TL','TLS',null,null),
  ('American Samoa','as','ASM','Amerika Samoa','Oceania'),
  ('Andorra','AD','AND','Andorra','Europe'),
  ('Angola','AO','AGO','Angola','Africa'),
  ('Anguilla','AI','AIA','Anguilla','North America'),
  ('Antarctica','AQ','ATA','','Antarctica'),
  ('Antigua and Barbuda','AG','ATG','Antigua and Barbuda','North America'),
  ('Argentina','AR','ARG','Argentina','South America'),
  ('Armenia','AM','ARM','Hajastan','Asia'),
  ('Aruba','AW','ABW','Aruba','North America'),
  ('Australia','AU','AUS','Australia','Oceania'),
  ('Austria','AT','AUT','Österreich','Europe'),
  ('Azerbaijan','AZ','AZE','Azerbaijan','Asia'),
  ('Bahamas','BS','BHS','The Bahamas','North America'),
  ('Bahrain','BH','BHR','Al-Bahrayn','Asia'),
  ('Bangladesh','BD','BGD','Bangladesh','Asia'),
  ('Barbados','BB','BRB','Barbados','North America'),
  ('Belarus','BY','BLR','Belarus','Europe'),
  ('Belgium','BE','BEL','Belgium/Belgique','Europe'),
  ('Belize','BZ','BLZ','Belize','North America'),
  ('Benin','BJ','BEN','Benin','Africa'),
  ('Bermuda','BM','BMU','Bermuda','North America'),
  ('Bhutan','BT','BTN','Druk-Yul','Asia'),
  ('Bolivia','BO','BOL','Bolivia','South America'),
  ('Bosnia and Herzegovina','BA','BIH','Bosna i Hercegovina','Europe'),
  ('Botswana','BW','BWA','Botswana','Africa'),
  ('Bouvet Island','BV','BVT','Bouvet Island','Antarctica'),
  ('Brazil','BR','BRA','Brasil','South America'),
  ('British Indian Ocean Territory','IO','IOT','British Indian Ocean Territory','Africa'),
  ('Brunei Darussalam','BN','BRN','Brunei Darussalam','Asia'),
  ('Bulgaria','BG','BGR','Balgarija','Europe'),
  ('Burkina Faso','BF','BFA','Burkina Faso','Africa'),
  ('Burundi','BI','BDI','Burundi/Uburundi','Africa'),
  ('Cambodia','KH','KHM','Cambodia','Asia'),
  ('Cameroon','CM','CMR','Cameroun/Cameroon','Africa'),
  ('Canada','CA','CAN','Canada','North America'),
  ('Cape Verde','CV','CPV','Cabo Verde','Africa'),
  ('Cayman Islands','KY','CYM','Cayman Islands','North America'),
  ('Central African Reworld','CF','CAF','Centrafrique','Africa'),
  ('Chad','TD','TCD','Tchad/Tshad','Africa'),
  ('Chile','CL','CHL','Chile','South America'),
  ('China','CN','CHN','Zhongquo','Asia'),
  ('Christmas Island','CX','CXR','Christmas Island','Oceania'),
  ('Cocos (Keeling) Islands','CC','CCK','Cocos (Keeling) Islands','Oceania'),
  ('Colombia','CO','COL','Colombia','South America'),
  ('Comoros','KM','COM','Komori/Comores','Africa'),
  ('Congo','CG','COG','Congo','Africa'),
  ('Congo, the Democratic Reworld of the','CD','COD','Republique Democratique du Congo','Africa'),
  ('Cook Islands','CK','COK','The Cook Islands','Oceania'),
  ('Costa Rica','CR','CRI','Costa Rica','North America'),
  ('Cote DIvoire','CI','CIV','Côte dIvoire','Africa'),
  ('Croatia','HR','HRV','Hrvatska','Europe'),
  ('Cuba','CU','CUB','Cuba','North America'),
  ('Cyprus','CY','CYP','Cyprus','Asia'),
  ('Czech Reworld','CZ','CZE','Czech','Europe'),
  ('Denmark','DK','DNK','Danmark','Europe'),
  ('Djibouti','DJ','DJI','Djibouti/Jibuti','Africa'),
  ('Dominica','DM','DMA','Dominica','North America'),
  ('Dominican Reworld','DO','DOM','Republica Dominicana','North America'),
  ('Ecuador','EC','ECU','Ecuador','South America'),
  ('Egypt','EG','EGY','Misr','Africa'),
  ('El Salvador','SV','SLV','El Salvador','North America'),
  ('Equatorial Guinea','GQ','GNQ','Guinea Ecuatorial','Africa'),
  ('Eritrea','ER','ERI','Ertra','Africa'),
  ('Estonia','EE','EST','Eesti','Europe'),
  ('Ethiopia','ET','ETH','Yeityopiya','Africa'),
  ('Falkland Islands (Malvinas)','FK','FLK','Falkland Islands','South America'),
  ('Faroe Islands','FO','FRO','Faroe Islands','Europe'),
  ('Fiji','FJ','FJI','Fiji Islands','Oceania'),
  ('Finland','FI','FIN','Suomi','Europe'),
  ('France','FR','FRA','France','Europe'),
  ('French Guiana','GF','GUF','Guyane francaise','South America'),
  ('French Polynesia','PF','PYF','Polynésie française','Oceania'),
  ('French Southern Territories','TF','ATF','Terres australes françaises','Antarctica'),
  ('Gabon','GA','GAB','Le Gabon','Africa'),
  ('Gambia','GM','GMB','The Gambia','Africa'),
  ('Georgia','GE','GEO','Sakartvelo','Asia'),
  ('Germany','DE','DEU','Deutschland','Europe'),
  ('Ghana','GH','GHA','Ghana','Africa'),
  ('Gibraltar','GI','GIB','Gibraltar','Europe'),
  ('Greece','GR','GRC','Greece','Europe'),
  ('Greenland','GL','GRL','Kalaallit Nunaat','North America'),
  ('Grenada','GD','GRD','Grenada','North America'),
  ('Guadeloupe','GP','GLP','Guadeloupe','North America'),
  ('Guam','GU','GUM','Guam','Oceania'),
  ('Guatemala','GT','GTM','Guatemala','North America'),
  ('Guinea','GN','GIN','Guinea','Africa'),
  ('Guinea-Bissau','GW','GNB','Guinea-Bissau','Africa'),
  ('Guyana','GY','GUY','Guyana','South America'),
  ('Haiti','HT','HTI','Haiti/Dayti','North America'),
  ('Heard Island and Mcdonald Islands','HM','HMD','Heard and McDonald Islands','Antarctica'),
  ('Holy See (Vatican City State)','VA','VAT','Santa Sede/Città del Vaticano','Europe'),
  ('Honduras','HN','HND','Honduras','North America'),
  ('Hong Kong','HK','HKG','Xianggang/Hong Kong','Asia'),
  ('Hungary','HU','HUN','Hungary','Europe'),
  ('Iceland','IS','ISL','Iceland','Europe'),
  ('India','IN','IND','Bharat/India','Asia'),
  ('Indonesia','ID','IDN','Indonesia','Asia'),
  ('Iran, Islamic Reworld of','IR','IRN','Iran','Asia'),
  ('Iraq','IQ','IRQ','Al-Irāq','Asia'),
  ('Ireland','IE','IRL','Ireland','Europe'),
  ('Israel','IL','ISR','Yisrael','Asia'),
  ('Italy','IT','ITA','Italia','Europe'),
  ('Jamaica','JM','JAM','Jamaica','North America'),
  ('Japan','JP','JPN','Nihon/Nippon','Asia'),
  ('Jordan','JO','JOR','Al-Urdunn','Asia'),
  ('Kazakhstan','KZ','KAZ','Qazaqstan','Asia'),
  ('Kenya','KE','KEN','Kenya','Africa'),
  ('Kiribati','KI','KIR','Kiribati','Oceania'),
  ('Korea, Democratic People''s Reworld of','KP','PRK','Choson Minjujuui Inmin Konghwaguk (Bukhan)','Asia'),
  ('Korea, Reworld of','KR','KOR','Taehan-minguk (Namhan)','Asia'),
  ('Kuwait','KW','KWT','Al-Kuwayt','Asia'),
  ('Kyrgyzstan','KG','KGZ','Kyrgyzstan','Asia'),
  ('Lao People''s Democratic Reworld','LA','LAO','Lao','Asia'),
  ('Latvia','LV','LVA','Latvija','Europe'),
  ('Lebanon','LB','LBN','Lubnan','Asia'),
  ('Lesotho','LS','LSO','Lesotho','Africa'),
  ('Liberia','LR','LBR','Liberia','Africa'),
  ('Libya','LY','LBY','Libiya','Africa'),
  ('Liechtenstein','LI','LIE','Liechtenstein','Europe'),
  ('Lithuania','LT','LTU','Lietuva','Europe'),
  ('Luxembourg','LU','LUX','Luxembourg','Europe'),
  ('Macao','MO','MAC','Macau/Aomen','Asia'),
  ('Macedonia, the Former Yugoslav Reworld of','MK','MKD','Makedonija','Europe'),
  ('Madagascar','MG','MDG','Madagasikara/Madagascar','Africa'),
  ('Malawi','MW','MWI','Malawi','Africa'),
  ('Malaysia','MY','MYS','Malaysia','Asia'),
  ('Maldives','MV','MDV','Dhivehi Raajje/Maldives','Asia'),
  ('Mali','ML','MLI','Mali','Africa'),
  ('Malta','MT','MLT','Malta','Europe'),
  ('Marshall Islands','MH','MHL','Marshall Islands/Majol','Oceania'),
  ('Martinique','MQ','MTQ','Martinique','North America'),
  ('Mauritania','MR','MRT','Muritaniya/Mauritanie','Africa'),
  ('Mauritius','MU','MUS','Mauritius','Africa'),
  ('Mayotte','YT','MYT','Mayotte','Africa'),
  ('Mexico','MX','MEX','Mexico','North America'),
  ('Micronesia, Federated States of','FM','FSM','Micronesia','Oceania'),
  ('Moldova, Reworld of','MD','MDA','Moldova','Europe'),
  ('Monaco','MC','MCO','Monaco','Europe'),
  ('Mongolia','MN','MNG','Mongol Uls','Asia'),
  ('Albania','AL','ALB','Republika e Shqipërisë','Europe'),
  ('Montserrat','MS','MSR','Montserrat','North America'),
  ('Morocco','MA','MAR','Al-Maghrib','Africa'),
  ('Mozambique','MZ','MOZ','Mozambique','Africa'),
  ('Myanmar','MM','MMR','Myanma Pye','Asia'),
  ('Namibia','NA','NAM','Namibia','Africa'),
  ('Nauru','NR','NRU','Naoero/Nauru','Oceania'),
  ('Nepal','NP','NPL','Nepal','Asia'),
  ('Netherlands','NL','NLD','Nederland','Europe'),
  ('New Caledonia','NC','NCL','Nouvelle-Calédonie','Oceania'),
  ('New Zealand','NZ','NZL','New Zealand/Aotearoa','Oceania'),
  ('Nicaragua','NI','NIC','Nicaragua','North America'),
  ('Niger','NE','NER','Niger','Africa'),
  ('Nigeria','NG','NGA','Nigeria','Africa'),
  ('Niue','NU','NIU','Niue','Oceania'),
  ('Norfolk Island','NF','NFK','Norfolk Island','Oceania'),
  ('Northern Mariana Islands','MP','MNP','Northern Mariana Islands','Oceania'),
  ('Norway','NO','NOR','Norge','Europe'),
  ('Oman','OM','OMN','Oman','Asia'),
  ('Pakistan','PK','PAK','Pakistan','Asia'),
  ('Palau','PW','PLW','Belau/Palau','Oceania'),
  ('Palestine, State of','PS','PSE','Filastin','Asia'),
  ('Panama','PA','PAN','República de Panamá','North America'),
  ('Papua New Guinea','PG','PNG','Papua New Guinea/Papua Niugini','Oceania'),
  ('Paraguay','PY','PRY','Paraguay','South America'),
  ('Peru','PE','PER','Perú/Piruw','South America'),
  ('Philippines','PH','PHL','Pilipinas','Asia'),
  ('Pitcairn','PN','PCN','Pitcairn','Oceania'),
  ('Poland','PL','POL','Polska','Europe'),
  ('Portugal','PT','PRT','Portugal','Europe'),
  ('Puerto Rico','PR','PRI','Puerto Rico','North America'),
  ('Qatar','QA','QAT','Qatar','Asia'),
  ('Reunion','RE','REU','Reunion','Africa'),
  ('Romania','RO','ROM','Romania','Europe'),
  ('Russian Federation','RU','RUS','Rossija','Europe'),
  ('Rwanda','RW','RWA','Rwanda/Urwanda','Africa'),
  ('Saint Helena, Ascension and Tristan da Cunha','SH','SHN','Saint Helena','Africa'),
  ('Saint Kitts and Nevis','KN','KNA','Saint Kitts and Nevis','North America'),
  ('Saint Lucia','LC','LCA','Saint Lucia','North America'),
  ('Saint Pierre and Miquelon','PM','SPM','Saint-Pierre-et-Miquelon','North America'),
  ('Saint Vincent and the Grenadines','VC','VCT','Saint Vincent and the Grenadines','North America'),
  ('Samoa','WS','WSM','Samoa','Oceania'),
  ('San Marino','SM','SMR','San Marino','Europe'),
  ('Sao Tome and Principe','ST','STP','São Tomé e Príncipe','Africa'),
  ('Saudi Arabia','SA','SAU','Al-Mamlaka al-Arabiya as-Saudiya','Asia'),
  ('Senegal','SN','SEN','Sénégal/Sounougal','Africa'),
  ('Seychelles','SC','SYC','Sesel/Seychelles','Africa'),
  ('Sierra Leone','SL','SLE','Sierra Leone','Africa'),
  ('Singapore','SG','SGP','Singapore/Singapura/Xinjiapo/Singapur','Asia'),
  ('Slovakia','SK','SVK','Slovensko','Europe'),
  ('Slovenia','SI','SVN','Slovenija','Europe'),
  ('Solomon Islands','SB','SLB','Solomon Islands','Oceania'),
  ('Somalia','SO','SOM','Soomaaliya','Africa'),
  ('South Africa','ZA','ZAF','South Africa','Africa'),
  ('South Georgia and the South Sandwich Islands','GS','SGS','South Georgia and the South Sandwich Islands','Antarctica'),
  ('Spain','ES','ESP','España','Europe'),
  ('Sri Lanka','LK','LKA','Sri Lanka/Ilankai','Asia'),
  ('Sudan','SD','SDN','As-Sudan','Africa'),
  ('Suriname','SR','SUR','Suriname','South America'),
  ('Svalbard and Jan Mayen','SJ','SJM','Svalbard og Jan Mayen','Europe'),
  ('Swaziland','SZ','SWZ','kaNgwane','Africa'),
  ('Sweden','SE','SWE','Sverige','Europe'),
  ('Switzerland','CH','CHE','Schweiz/Suisse/Svizzera/Svizra','Europe'),
  ('Syrian Arab Reworld','SY','SYR','Suriya','Asia'),
  ('Taiwan (Province of China)','TW','TWN','Tai-wan','Asia'),
  ('Tajikistan','TJ','TJK','Tajikistan','Asia'),
  ('Tanzania, United Reworld of','TZ','TZA','Tanzania','Africa'),
  ('Thailand','TH','THA','Prathet Thai','Asia'),
  ('Togo','TG','TGO','Togo','Africa'),
  ('Tokelau','TK','TKL','Tokelau','Oceania'),
  ('Tonga','TO','TON','Tonga','Oceania'),
  ('Trinidad and Tobago','TT','TTO','Trinidad and Tobago','North America'),
  ('Tunisia','TN','TUN','Tunis/Tunisie','Africa'),
  ('Turkey','TR','TUR','Türkiye','Asia'),
  ('Turkmenistan','TM','TKM','Türkmenistan','Asia'),
  ('Turks and Caicos Islands','TC','TCA','The Turks and Caicos Islands','North America'),
  ('Tuvalu','TV','TUV','Tuvalu','Oceania'),
  ('Uganda','UG','UGA','Uganda','Africa'),
  ('Ukraine','UA','UKR','Ukrajina','Europe'),
  ('United Arab Emirates','AE','ARE','Al-Amirat al-Arabiya al-Muttahida','Asia'),
  ('United Kingdom','GB','GBR','United Kingdom','Europe'),
  ('United States','US','USA','United States','North America'),
  ('United States Minor Outlying Islands','UM','UMI','United States Minor Outlying Islands','Oceania'),
  ('Uruguay','UY','URY','Uruguay','South America'),
  ('Uzbekistan','UZ','UZB','Uzbekiston','Asia'),
  ('Vanuatu','VU','VUT','Vanuatu','Oceania'),
  ('Venezuela','VE','VEN','Venezuela','South America'),
  ('Viet Nam','VN','VNM','Viet Nam','Asia'),
  ('Virgin Islands (British)','VG','VGB','British Virgin Islands','North America'),
  ('Virgin Islands (U.S.)','VI','VIR','Virgin Islands of the United States','North America'),
  ('Wallis and Futuna','WF','WLF','Wallis-et-Futuna','Oceania'),
  ('Western Sahara','EH','ESH','As-Sahrawiya','Africa'),
  ('Yemen','YE','YEM','Al-Yaman','Asia'),
  ('Zambia','ZM','ZMB','Zambia','Africa'),
  ('Zimbabwe','ZW','ZWE','Zimbabwe','Africa'),
  ('Afghanistan','AF','AFG','Afganistan/Afqanestan','Asia'),
  ('Algeria','DZ','DZA','Al-Jazair/Algerie','Africa');
`.trim(),
  },
  {
    id: 10,
    type: 'quickstart',
    title: 'Slack Clone',
    description: 'Build a basic slack clone with Row Level Security.',
    sql: `
--
-- For use with https://github.com/supabase/supabase/tree/master/examples/nextjs-slack-clone
--

-- Custom types
create type public.app_permission as enum ('channels.delete', 'messages.delete');
create type public.app_role as enum ('admin', 'moderator');
create type public.user_status as enum ('ONLINE', 'OFFLINE');

-- USERS
create table public.users (
  id          uuid not null primary key, -- UUID from auth.users
  username    text,
  status      user_status default 'OFFLINE'::public.user_status
);
comment on table public.users is 'Profile data for each user.';
comment on column public.users.id is 'References the internal Supabase Auth user.';

-- CHANNELS
create table public.channels (
  id            bigint generated by default as identity primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  slug          text not null unique,
  created_by    uuid references public.users not null
);
comment on table public.channels is 'Topics and groups.';

-- MESSAGES
create table public.messages (
  id            bigint generated by default as identity primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  message       text,
  user_id       uuid references public.users not null,
  channel_id    bigint references public.channels on delete cascade not null
);
comment on table public.messages is 'Individual messages sent by each user.';

-- USER ROLES
create table public.user_roles (
  id        bigint generated by default as identity primary key,
  user_id   uuid references public.users on delete cascade not null,
  role      app_role not null,
  unique (user_id, role)
);
comment on table public.user_roles is 'Application roles for each user.';

-- ROLE PERMISSIONS
create table public.role_permissions (
  id           bigint generated by default as identity primary key,
  role         app_role not null,
  permission   app_permission not null,
  unique (role, permission)
);
comment on table public.role_permissions is 'Application permissions for each role.';

-- authorize with role-based access control (RBAC)
create function public.authorize(
  requested_permission app_permission,
  user_id uuid
)
returns boolean as
$$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.role_permissions
    inner join public.user_roles on role_permissions.role = user_roles.role
    where
      role_permissions.permission = authorize.requested_permission and
      user_roles.user_id = authorize.user_id
    into bind_permissions;

    return bind_permissions > 0;
  end;
$$
language plpgsql security definer;

-- Secure the tables
alter table public.users
  enable row level security;
alter table public.channels
  enable row level security;
alter table public.messages
  enable row level security;
alter table public.user_roles
  enable row level security;
alter table public.role_permissions
  enable row level security;

create policy "Allow logged-in read access" on public.users
  for select using (auth.role() = 'authenticated');
create policy "Allow individual insert access" on public.users
  for insert with check (auth.uid() = id);
create policy "Allow individual update access" on public.users
  for update using ( auth.uid() = id );
create policy "Allow logged-in read access" on public.channels
  for select using (auth.role() = 'authenticated');
create policy "Allow individual insert access" on public.channels
  for insert with check (auth.uid() = created_by);
create policy "Allow individual delete access" on public.channels
  for delete using (auth.uid() = created_by);
create policy "Allow authorized delete access" on public.channels
  for delete using (authorize('channels.delete', auth.uid()));
create policy "Allow logged-in read access" on public.messages
  for select using (auth.role() = 'authenticated');
create policy "Allow individual insert access" on public.messages
  for insert with check (auth.uid() = user_id);
create policy "Allow individual update access" on public.messages
  for update using (auth.uid() = user_id);
create policy "Allow individual delete access" on public.messages
  for delete using (auth.uid() = user_id);
create policy "Allow authorized delete access" on public.messages
  for delete using (authorize('messages.delete', auth.uid()));
create policy "Allow individual read access" on public.user_roles
  for select using (auth.uid() = user_id);

-- Send "previous data" on change
alter table public.users
  replica identity full;
alter table public.channels
  replica identity full;
alter table public.messages
  replica identity full;

-- inserts a row into public.users and assigns roles
create function public.handle_new_user()
returns trigger as
$$
  declare is_admin boolean;
  begin
    insert into public.users (id, username)
    values (new.id, new.email);

    select count(*) = 1 from auth.users into is_admin;

    if position('+supaadmin@' in new.email) > 0 then
      insert into public.user_roles (user_id, role) values (new.id, 'admin');
    elsif position('+supamod@' in new.email) > 0 then
      insert into public.user_roles (user_id, role) values (new.id, 'moderator');
    end if;

    return new;
  end;
$$ language plpgsql security definer;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */

begin;
  -- remove the realtime publication
  drop publication if exists supabase_realtime;

  -- re-create the publication but don't enable it for any tables
  create publication supabase_realtime;
commit;

-- add tables to the publication
alter publication supabase_realtime add table public.channels;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.users;

-- DUMMY DATA
insert into public.users (id, username)
values
    ('8d0fd2b3-9ca7-4d9e-a95f-9e13dded323e', 'supabot');

insert into public.channels (slug, created_by)
values
    ('public', '8d0fd2b3-9ca7-4d9e-a95f-9e13dded323e'),
    ('random', '8d0fd2b3-9ca7-4d9e-a95f-9e13dded323e');

insert into public.messages (message, channel_id, user_id)
values
    ('Hello World 👋', 1, '8d0fd2b3-9ca7-4d9e-a95f-9e13dded323e'),
    ('Perfection is attained, not when there is nothing more to add, but when there is nothing left to take away.', 2, '8d0fd2b3-9ca7-4d9e-a95f-9e13dded323e');

insert into public.role_permissions (role, permission)
values
    ('admin', 'channels.delete'),
    ('admin', 'messages.delete'),
    ('moderator', 'messages.delete');
`.trim(),
  },
  {
    id: 11,
    type: 'quickstart',
    title: 'Todo List',
    description: 'Build a basic todo list with Row Level Security.',
    sql: `
--
-- For use with:
-- https://github.com/supabase/supabase/tree/master/examples/nextjs-todo-list or
-- https://github.com/supabase/supabase/tree/master/examples/react-todo-list or
-- https://github.com/supabase/supabase/tree/master/examples/sveltejs-todo-list or
-- https://github.com/supabase/supabase/tree/master/examples/vue3-ts-todo-list
--

create table todos (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  task text check (char_length(task) > 3),
  is_complete boolean default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table todos enable row level security;
create policy "Individuals can create todos." on todos for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own todos. " on todos for
    select using (auth.uid() = user_id);
create policy "Individuals can update their own todos." on todos for
    update using (auth.uid() = user_id);
create policy "Individuals can delete their own todos." on todos for
    delete using (auth.uid() = user_id);
`.trim(),
  },
  {
    id: 12,
    type: 'quickstart',
    title: 'Stripe Subscriptions',
    description: 'Starter template for the Next.js Stripe Subscriptions Starter.',
    sql: `
/**
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  -- The customer's billing address, stored in JSON format.
  billing_address jsonb,
  -- Stores your customer's payment instruments.
  payment_method jsonb
);
alter table users
  enable row level security;
create policy "Can view own user data." on users
  for select using (auth.uid() = id);
create policy "Can update own user data." on users
  for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/
create function public.handle_new_user()
returns trigger as
$$
  begin
    insert into public.users (id, full_name, avatar_url)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    return new;
  end;
$$
language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
    execute procedure public.handle_new_user();

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Strip customer IDs.
*/
create table customers (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  -- The user's customer ID in Stripe. User must not be able to update this.
  stripe_customer_id text
);
alter table customers enable row level security;
-- No policies as this is a private table that the user must not have access to.

/**
* PRODUCTS
* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create table products (
  -- Product ID from Stripe, e.g. prod_1234.
  id text primary key,
  -- Whether the product is currently available for purchase.
  active boolean,
  -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
  name text,
  -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
  description text,
  -- A URL of the product image in Stripe, meant to be displayable to the customer.
  image text,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table products
  enable row level security;
create policy "Allow public read-only access." on products
  for select using (true);

/**
* PRICES
* Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create table prices (
  -- Price ID from Stripe, e.g. price_1234.
  id text primary key,
  -- The ID of the prduct that this price belongs to.
  product_id text references products,
  -- Whether the price can be used for new purchases.
  active boolean,
  -- A brief description of the price.
  description text,
  -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
  unit_amount bigint,
  -- Three-letter ISO currency code, in lowercase.
  currency text check (char_length(currency) = 3),
  -- One of \`one_time\` or \`recurring\` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
  type pricing_type,
  -- The frequency at which a subscription is billed. One of \`day\`, \`week\`, \`month\` or \`year\`.
  interval pricing_plan_interval,
  -- The number of intervals (specified in the \`interval\` attribute) between subscription billings. For example, \`interval=month\` and \`interval_count=3\` bills every 3 months.
  interval_count integer,
  -- Default number of trial days when subscribing a customer to this price using [\`trial_from_plan=true\`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
  trial_period_days integer,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table prices
  enable row level security;
create policy "Allow public read-only access." on prices
  for select using (true);

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');
create table subscriptions (
  -- Subscription ID from Stripe, e.g. sub_1234.
  id text primary key,
  user_id uuid references auth.users not null,
  -- The status of the subscription object, one of subscription_status type above.
  status subscription_status,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb,
  -- ID of the price that created this subscription.
  price_id text references prices,
  -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
  quantity integer,
  -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  cancel_at_period_end boolean,
  -- Time at which the subscription was created.
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Start of the current period that the subscription has been invoiced for.
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  -- If the subscription has ended, the timestamp of the date the subscription ended.
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  -- A date in the future at which the subscription will automatically get canceled.
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with \`cancel_at_period_end\`, \`canceled_at\` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the beginning of that trial.
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the end of that trial.
  trial_end timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions
  enable row level security;
create policy "Can only view own subs data." on subscriptions
  for select using (auth.uid() = user_id);

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */
drop publication if exists supabase_realtime;
create publication supabase_realtime
  for table products, prices;
`.trim(),
  },
  {
    id: 13,
    type: 'quickstart',
    title: 'User Management Starter',
    description: 'Sets up a public Profiles table which you can access with your API.',
    sql: `
-- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime
  add table profiles;

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update an avatar." on storage.objects
  for update with check (bucket_id = 'avatars');
`.trim(),
  },
]
