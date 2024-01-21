/*==============================================================*/
/* DBMS name:      ORACLE Version 19c                           */
/* Created on:     21.01.2024 13:53:25                          */
/*==============================================================*/



-- Type package declaration
create or replace package PDTypes  
as
    TYPE ref_cursor IS REF CURSOR;
end;

-- Integrity package declaration
create or replace package IntegrityPackage AS
 procedure InitNestLevel;
 function GetNestLevel return number;
 procedure NextNestLevel;
 procedure PreviousNestLevel;
 end IntegrityPackage;
/

-- Integrity package definition
create or replace package body IntegrityPackage AS
 NestLevel number;

-- Procedure to initialize the trigger nest level
 procedure InitNestLevel is
 begin
 NestLevel := 0;
 end;


-- Function to return the trigger nest level
 function GetNestLevel return number is
 begin
 if NestLevel is null then
     NestLevel := 0;
 end if;
 return(NestLevel);
 end;

-- Procedure to increase the trigger nest level
 procedure NextNestLevel is
 begin
 if NestLevel is null then
     NestLevel := 0;
 end if;
 NestLevel := NestLevel + 1;
 end;

-- Procedure to decrease the trigger nest level
 procedure PreviousNestLevel is
 begin
 NestLevel := NestLevel - 1;
 end;

 end IntegrityPackage;
/


drop trigger COMPOUNDDELETETRIGGER_ARZT
/

drop trigger COMPOUNDINSERTTRIGGER_ARZT
/

drop trigger COMPOUNDUPDATETRIGGER_ARZT
/

drop trigger COMPOUNDDELETETRIGGER_DIAGNOSE
/

drop trigger COMPOUNDINSERTTRIGGER_DIAGNOSE
/

drop trigger COMPOUNDUPDATETRIGGER_DIAGNOSE
/

drop trigger COMPOUNDDELETETRIGGER_KRANKENH
/

drop trigger COMPOUNDINSERTTRIGGER_KRANKENH
/

drop trigger COMPOUNDUPDATETRIGGER_KRANKENH
/

drop trigger COMPOUNDDELETETRIGGER_KRANKENP
/

drop trigger COMPOUNDINSERTTRIGGER_KRANKENP
/

drop trigger COMPOUNDUPDATETRIGGER_KRANKENP
/

drop trigger COMPOUNDDELETETRIGGER_LAGERRAU
/

drop trigger COMPOUNDINSERTTRIGGER_LAGERRAU
/

drop trigger COMPOUNDUPDATETRIGGER_LAGERRAU
/

drop trigger COMPOUNDDELETETRIGGER_OPERATIO
/

drop trigger COMPOUNDINSERTTRIGGER_OPERATIO
/

drop trigger COMPOUNDUPDATETRIGGER_OPERATIO
/

drop trigger COMPOUNDDELETETRIGGER_OPERATIO
/

drop trigger COMPOUNDINSERTTRIGGER_OPERATIO
/

drop trigger COMPOUNDUPDATETRIGGER_OPERATIO
/

drop trigger COMPOUNDDELETETRIGGER_RELATION
/

drop trigger COMPOUNDINSERTTRIGGER_RELATION
/

drop trigger COMPOUNDUPDATETRIGGER_RELATION
/

drop trigger COMPOUNDDELETETRIGGER_PATIENTE
/

drop trigger COMPOUNDINSERTTRIGGER_PATIENTE
/

drop trigger COMPOUNDUPDATETRIGGER_PATIENTE
/

drop trigger COMPOUNDDELETETRIGGER_STATION
/

drop trigger COMPOUNDINSERTTRIGGER_STATION
/

drop trigger COMPOUNDUPDATETRIGGER_STATION
/

drop trigger COMPOUNDDELETETRIGGER_RELATION
/

drop trigger COMPOUNDINSERTTRIGGER_RELATION
/

drop trigger COMPOUNDUPDATETRIGGER_RELATION
/

drop trigger COMPOUNDDELETETRIGGER_RELATION
/

drop trigger COMPOUNDINSERTTRIGGER_RELATION
/

drop trigger COMPOUNDUPDATETRIGGER_RELATION
/

drop trigger COMPOUNDDELETETRIGGER_THERAPIE
/

drop trigger COMPOUNDINSERTTRIGGER_THERAPIE
/

drop trigger COMPOUNDUPDATETRIGGER_THERAPIE
/

drop trigger COMPOUNDDELETETRIGGER_RELATION
/

drop trigger COMPOUNDINSERTTRIGGER_RELATION
/

drop trigger COMPOUNDUPDATETRIGGER_RELATION
/

alter table PATIENT_VERSICHERUNG
   drop constraint FK_PATIENT__REFERENCE_PATIENT
/

alter table PATIENT_VERSICHERUNG
   drop constraint FK_PATIENT__REFERENCE_VERSICHE
/

drop index RELATIONSHIP_8_FK
/

drop table ARZT cascade constraints
/

drop index FUHRT_DURCH_FK
/

drop index DURCHGEFUHRT_VON_FK
/

drop table ARZT_OPERATION cascade constraints
/

drop index RELATIONSHIP_26_FK
/

drop index RELATIONSHIP_25_FK
/

drop table DIAGNOSE cascade constraints
/

drop table KRANKENHAUS cascade constraints
/

drop index RELATIONSHIP_8_FK2
/

drop table KRANKENPFLEGER cascade constraints
/

drop index FUHRT_DURCH_FK2
/

drop index DURCHGEFUHRT_VON_FK2
/

drop table KRANKENPFLEGER_THERAPIE cascade constraints
/

drop index RELATIONSHIP_6_FK
/

drop table LAGERRAUM cascade constraints
/

drop index RELATIONSHIP_27_FK
/

drop index RELATIONSHIP_11_FK
/

drop table MEDIKAMENT cascade constraints
/

drop index RELATIONSHIP_16_FK
/

drop table OPERATION cascade constraints
/

drop index RELATIONSHIP_6_FK3
/

drop table OPERATIONSSAAL cascade constraints
/

drop index BASIERT_AUF_FK2
/

drop index VERANLASST_FK2
/

drop table OPERATION_DIAGNOSE cascade constraints
/

drop index RELATIONSHIP_23_FK
/

drop index "1_FK"
/

drop table PATIENT cascade constraints
/

drop index RELATIONSHIP_6_FK2
/

drop table PATIENTENRAUM cascade constraints
/

drop table PATIENT_VERSICHERUNG cascade constraints
/

drop index RELATIONSHIP_22_FK
/

drop index RELATIONSHIP_21_FK
/

drop table RECHNUNG cascade constraints
/

drop index RELATIONSHIP_7_FK
/

drop table STATION cascade constraints
/

drop index ZUGEORDNET_FK
/

drop index GELEITET_VON_FK
/

drop table STATION_ARZT cascade constraints
/

drop index ZUGEORDNET_FK2
/

drop index GELEITET_VON_FK2
/

drop table STATION_KRANKENPFLEGER cascade constraints
/

drop table THERAPIE cascade constraints
/

drop index BASIERT_AUF_FK
/

drop index VERANLASST_FK
/

drop table THERAPIE_DIAGNOSE cascade constraints
/

drop table VERSICHERUNG cascade constraints
/

/*==============================================================*/
/* Table: ARZT                                                  */
/*==============================================================*/
create table ARZT (
   MITARBEITER_NR       NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   KRANKENHAUS_ID       NUMBER(1,0)           not null,
   NAME                 CHAR(256)             not null,
   VORNAME              CHAR(256)             not null,
   ARBEITSBEGINN        CHAR(256),
   ARBEITSENDE          CHAR(256),
   FACHRICHTUNG         CHAR(256)             not null,
   POSITION             CHAR(256)             not null,
   constraint PK_ARZT primary key (MITARBEITER_NR)
)
/

comment on column ARZT.MITARBEITER_NR is
'Primärschlüssel'
/

comment on column ARZT.KRANKENHAUS_ID is
'Sekundärschlüssel. In welchem Krankenhaus der Arzt eingestellt ist'
/

comment on column ARZT.NAME is
'Nachname des Personals'
/

comment on column ARZT.VORNAME is
'Vorname des Personals'
/

comment on column ARZT.ARBEITSBEGINN is
'Beginn der Arbeitszeit (Schicht) NULL = Momentan nicht am Arbeiten'
/

comment on column ARZT.ARBEITSENDE is
'Ende der Arbeitszeit (Schicht)  NULL = Momentan nicht am Arbeiten'
/

comment on column ARZT.FACHRICHTUNG is
'Medizinische Gebiet in der sich der Arzt spezialisiert hat'
/

comment on column ARZT.POSITION is
'Position im Krankenhaus (Chefarzt, Oberarzt, Assistenzarzt)
'
/

/*==============================================================*/
/* Index: RELATIONSHIP_8_FK                                     */
/*==============================================================*/
create index RELATIONSHIP_8_FK on ARZT (
   KRANKENHAUS_ID ASC
)
/

/*==============================================================*/
/* Table: ARZT_OPERATION                                        */
/*==============================================================*/
create table ARZT_OPERATION (
   MITARBEITER_NR       NUMBER                not null,
   BEHANDLUNGS_ID       NUMBER                not null,
   constraint PK_ARZT_OPERATION primary key (MITARBEITER_NR, BEHANDLUNGS_ID)
)
/

comment on column ARZT_OPERATION.MITARBEITER_NR is
'Primärschlüssel'
/

comment on column ARZT_OPERATION.BEHANDLUNGS_ID is
'Primärschlüssel'
/

/*==============================================================*/
/* Index: DURCHGEFUHRT_VON_FK                                   */
/*==============================================================*/
create index DURCHGEFUHRT_VON_FK on ARZT_OPERATION (
   MITARBEITER_NR ASC
)
/

/*==============================================================*/
/* Index: FUHRT_DURCH_FK                                        */
/*==============================================================*/
create index FUHRT_DURCH_FK on ARZT_OPERATION (
   BEHANDLUNGS_ID ASC
)
/

/*==============================================================*/
/* Table: DIAGNOSE                                              */
/*==============================================================*/
create table DIAGNOSE (
   DIAGNOSE_ID          NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   PATIENTEN_ID         NUMBER                not null,
   MITARBEITER_NR       NUMBER                not null,
   DIAGNOSE_DATUM       DATE                  not null,
   BESCHREIBUNG         VARCHAR2(1024)        not null,
   STATUS               NUMBER(1,0)          default 1  not null
      constraint CKC_STATUS_DIAGNOSE check (STATUS between 0 and 1),
   constraint PK_DIAGNOSE primary key (DIAGNOSE_ID)
)
/

comment on column DIAGNOSE.DIAGNOSE_ID is
'Primärschlüssel'
/

comment on column DIAGNOSE.PATIENTEN_ID is
'Sekundärschlüssel. Welchem Patienten ist die Diagnose zugeordnet'
/

comment on column DIAGNOSE.MITARBEITER_NR is
'Sekundärschlüssel. Welcher Arzt hat die Diagnose erstellt'
/

comment on column DIAGNOSE.DIAGNOSE_DATUM is
'Wann wurde die Diagnose erstellt'
/

comment on column DIAGNOSE.BESCHREIBUNG is
'Beschreibung was diagnostiziert wurde'
/

comment on column DIAGNOSE.STATUS is
'0 = Behandlung abgeschlossen 1 = nicht behandelt'
/

/*==============================================================*/
/* Index: RELATIONSHIP_25_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_25_FK on DIAGNOSE (
   PATIENTEN_ID ASC
)
/

/*==============================================================*/
/* Index: RELATIONSHIP_26_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_26_FK on DIAGNOSE (
   MITARBEITER_NR ASC
)
/

/*==============================================================*/
/* Table: KRANKENHAUS                                           */
/*==============================================================*/
create table KRANKENHAUS (
   KRANKENHAUS_ID       NUMBER(1,0)         
      generated always as identity ( start with 1 increment by 1 maxvalue 5 minvalue 1 nocycle noorder)  not null
      constraint CKC_KRANKENHAUS_ID_KRANKENH check (KRANKENHAUS_ID between 1 and 5),
   STADT                CHAR(75)              not null,
   ADRESSE              VARCHAR2(1024)        not null,
   NAME                 CHAR(70)              not null,
   constraint PK_KRANKENHAUS primary key (KRANKENHAUS_ID)
)
/

comment on column KRANKENHAUS.KRANKENHAUS_ID is
'Primärschlüssel'
/

comment on column KRANKENHAUS.STADT is
'Stadt in der sich das KH befindet'
/

comment on column KRANKENHAUS.ADRESSE is
'Anschrift des KH'
/

comment on column KRANKENHAUS.NAME is
'Name des Krankenhauses'
/

/*==============================================================*/
/* Table: KRANKENPFLEGER                                        */
/*==============================================================*/
create table KRANKENPFLEGER (
   MITARBEITER_NR       NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   KRANKENHAUS_ID       NUMBER(1,0)           not null,
   NAME                 CHAR(256)             not null,
   VORNAME              CHAR(256)             not null,
   ARBEITSBEGINN        CHAR(256),
   ARBEITSENDE          CHAR(256),
   QUALIFIKATIONEN      VARCHAR2(1024)        not null,
   BERECHTIGUNGEN       NUMBER(1,0)          default 1  not null
      constraint CKC_BERECHTIGUNGEN_KRANKENP check (BERECHTIGUNGEN between 1 and 3),
   constraint PK_KRANKENPFLEGER primary key (MITARBEITER_NR)
)
/

comment on column KRANKENPFLEGER.MITARBEITER_NR is
'Primärschlüssel'
/

comment on column KRANKENPFLEGER.KRANKENHAUS_ID is
'Sekundärschlüssel. In welchem Krankenhaus ist der Krankenpfleger eingestellt'
/

comment on column KRANKENPFLEGER.NAME is
'Nachname des Personals'
/

comment on column KRANKENPFLEGER.VORNAME is
'Vorname des Personals'
/

comment on column KRANKENPFLEGER.ARBEITSBEGINN is
'Beginn der Arbeitszeit (Schicht) NULL = Momentan nicht am Arbeiten'
/

comment on column KRANKENPFLEGER.ARBEITSENDE is
'Ende der Arbeitszeit (Schicht)  NULL = Momentan nicht am Arbeiten'
/

comment on column KRANKENPFLEGER.QUALIFIKATIONEN is
'Fachkompetenz und die Fähigkeit zur Anwendung von Kenntnissen und Fertigkeiten
'
/

comment on column KRANKENPFLEGER.BERECHTIGUNGEN is
'Berechtigungsstufe bestimmte Therapien auszuführen. Je > die Zahl, desto höher die Berechtigung (1-3)
'
/

/*==============================================================*/
/* Index: RELATIONSHIP_8_FK2                                    */
/*==============================================================*/
create index RELATIONSHIP_8_FK2 on KRANKENPFLEGER (
   KRANKENHAUS_ID ASC
)
/

/*==============================================================*/
/* Table: KRANKENPFLEGER_THERAPIE                               */
/*==============================================================*/
create table KRANKENPFLEGER_THERAPIE (
   MITARBEITER_NR       NUMBER                not null,
   BEHANDLUNGS_ID       NUMBER                not null,
   constraint PK_KRANKENPFLEGER_THERAPIE primary key (MITARBEITER_NR, BEHANDLUNGS_ID)
)
/

comment on column KRANKENPFLEGER_THERAPIE.MITARBEITER_NR is
'Primärschlüssel'
/

comment on column KRANKENPFLEGER_THERAPIE.BEHANDLUNGS_ID is
'Primärschlüssel'
/

/*==============================================================*/
/* Index: DURCHGEFUHRT_VON_FK2                                  */
/*==============================================================*/
create index DURCHGEFUHRT_VON_FK2 on KRANKENPFLEGER_THERAPIE (
   MITARBEITER_NR ASC
)
/

/*==============================================================*/
/* Index: FUHRT_DURCH_FK2                                       */
/*==============================================================*/
create index FUHRT_DURCH_FK2 on KRANKENPFLEGER_THERAPIE (
   BEHANDLUNGS_ID ASC
)
/

/*==============================================================*/
/* Table: LAGERRAUM                                             */
/*==============================================================*/
create table LAGERRAUM (
   LAGERRAUM_ID         NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   STATIONS_ID          NUMBER                not null,
   RAUM_NR              NUMBER                not null,
   LAGERKAPAZITAET      NUMBER(38,0)          not null,
   constraint PK_LAGERRAUM primary key (LAGERRAUM_ID)
)
/

comment on column LAGERRAUM.LAGERRAUM_ID is
'Primärschlüssel'
/

comment on column LAGERRAUM.STATIONS_ID is
'Sekundärschlüssel. In welcher Station befindet sich der Raum'
/

comment on column LAGERRAUM.RAUM_NR is
'Die Raumnummer'
/

comment on column LAGERRAUM.LAGERKAPAZITAET is
'Wie viele Medikamente können maximal gelagert werden'
/

/*==============================================================*/
/* Index: RELATIONSHIP_6_FK                                     */
/*==============================================================*/
create index RELATIONSHIP_6_FK on LAGERRAUM (
   STATIONS_ID ASC
)
/

/*==============================================================*/
/* Table: MEDIKAMENT                                            */
/*==============================================================*/
create table MEDIKAMENT (
   MEDIKAMENTEN_NR      NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   PATIENTEN_ID         NUMBER,
   RAUM_ID              NUMBER                not null,
   NAME                 CHAR(256)             not null,
   INFO                 VARCHAR2(1024),
   NEBENWIRKUNGEN       VARCHAR2(1024),
   BESTELLSTATUS        NUMBER(1,0)          default 0  not null
      constraint CKC_BESTELLSTATUS_MEDIKAME check (BESTELLSTATUS between 0 and 1),
   constraint PK_MEDIKAMENT primary key (MEDIKAMENTEN_NR)
)
/

comment on column MEDIKAMENT.MEDIKAMENTEN_NR is
'Primärschlüssel'
/

comment on column MEDIKAMENT.PATIENTEN_ID is
'Sekundärschlüssel. Welchem Patienten das Medikament zugeordnet ist'
/

comment on column MEDIKAMENT.RAUM_ID is
'Sekundärschlüssel. In welchem Lagerraum sich das Medikament befindet oder geliefert wird'
/

comment on column MEDIKAMENT.NAME is
'Name des Medikamentes'
/

comment on column MEDIKAMENT.INFO is
'Genauere Information was das Medikament bewirkt
'
/

comment on column MEDIKAMENT.NEBENWIRKUNGEN is
'Eventuelle Nebenwirkungen die das Medikament mit sich bringt
Eventuelle Nebenwirkungen die das Medikament mit sich bringt
Eventuelle Nebenwirkungen die das Medikament mit sich bringt
Eventuelle Nebenwirkungen die das Medikament mit sich bringt
'
/

comment on column MEDIKAMENT.BESTELLSTATUS is
'Gibt an ob das Medikament im Lager liegt oder noch ins Lager geliefert wird. 0 = in Bestellung 1 = Im Lager'
/

/*==============================================================*/
/* Index: RELATIONSHIP_11_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_11_FK on MEDIKAMENT (
   RAUM_ID ASC
)
/

/*==============================================================*/
/* Index: RELATIONSHIP_27_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_27_FK on MEDIKAMENT (
   PATIENTEN_ID ASC
)
/

/*==============================================================*/
/* Table: OPERATION                                             */
/*==============================================================*/
create table OPERATION (
   BEHANDLUNGS_ID       NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   RAUM_ID              NUMBER                not null,
   BEZEICHNUNG          CHAR(256)             not null,
   INFO                 VARCHAR2(1024),
   BERECHTIGUNGSSTUFE   NUMBER(1,0)           not null
      constraint CKC_BERECHTIGUNGSSTUF_OPERATIO check (BERECHTIGUNGSSTUFE between 1 and 3),
   STARTZEIT            DATE                  not null,
   ENDZEIT              DATE                  not null,
   constraint PK_OPERATION primary key (BEHANDLUNGS_ID)
)
/

comment on column OPERATION.BEHANDLUNGS_ID is
'Primärschlüssel'
/

comment on column OPERATION.RAUM_ID is
'Sekundärschlüssel. In welchem Operationssaal ist die Operation gebucht'
/

comment on column OPERATION.BEZEICHNUNG is
'Oberbegriff für die Behandlung
'
/

comment on column OPERATION.INFO is
'Weitere Informationen zur Behandlung'
/

comment on column OPERATION.BERECHTIGUNGSSTUFE is
'Die Berechtigungsstufe die Mitarbeiter benötigen, um die Behandlung durchzuführen '
/

comment on column OPERATION.STARTZEIT is
'Datum wann die Behandlung beginnt'
/

comment on column OPERATION.ENDZEIT is
'Voraussichtliche Beendigung der Behandlung
'
/

/*==============================================================*/
/* Index: RELATIONSHIP_16_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_16_FK on OPERATION (
   RAUM_ID ASC
)
/

/*==============================================================*/
/* Table: OPERATIONSSAAL                                        */
/*==============================================================*/
create table OPERATIONSSAAL (
   OPERATIONSSAAL_ID    NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   STATIONS_ID          NUMBER                not null,
   RAUM_NR              NUMBER                not null,
   PERSONENKAPAZITAET   NUMBER                not null,
   OEFFNUNGSZEIT        CHAR(15),
   SCHLIESSUNGSZEIT     CHAR(15),
   constraint PK_OPERATIONSSAAL primary key (OPERATIONSSAAL_ID)
)
/

comment on column OPERATIONSSAAL.OPERATIONSSAAL_ID is
'Primärschlüssel'
/

comment on column OPERATIONSSAAL.STATIONS_ID is
'Sekundärschlüssel. In welcher Station befindet sich der Raum'
/

comment on column OPERATIONSSAAL.RAUM_NR is
'Die Raumnummer'
/

comment on column OPERATIONSSAAL.PERSONENKAPAZITAET is
'Wie viele Personen sind während der Operation maximal erlaubt
Wie viele Personen sind während der Operation maximal erlaubt'
/

comment on column OPERATIONSSAAL.OEFFNUNGSZEIT is
'Wann wird der Raum für Operationen geöffnet. NULL = Raum steht nicht zur Verfügung'
/

comment on column OPERATIONSSAAL.SCHLIESSUNGSZEIT is
'Wann wird der Raum für Operationen geschlossen. NULL = Raum steht nicht zur Verfügung'
/

/*==============================================================*/
/* Index: RELATIONSHIP_6_FK3                                    */
/*==============================================================*/
create index RELATIONSHIP_6_FK3 on OPERATIONSSAAL (
   STATIONS_ID ASC
)
/

/*==============================================================*/
/* Table: OPERATION_DIAGNOSE                                    */
/*==============================================================*/
create table OPERATION_DIAGNOSE (
   BEHANDLUNGS_ID       NUMBER                not null,
   DIAGNOSE_ID          NUMBER                not null,
   constraint PK_OPERATION_DIAGNOSE primary key (BEHANDLUNGS_ID, DIAGNOSE_ID)
)
/

comment on column OPERATION_DIAGNOSE.BEHANDLUNGS_ID is
'Primärschlüssel'
/

comment on column OPERATION_DIAGNOSE.DIAGNOSE_ID is
'Primärschlüssel'
/

/*==============================================================*/
/* Index: VERANLASST_FK2                                        */
/*==============================================================*/
create index VERANLASST_FK2 on OPERATION_DIAGNOSE (
   BEHANDLUNGS_ID ASC
)
/

/*==============================================================*/
/* Index: BASIERT_AUF_FK2                                       */
/*==============================================================*/
create index BASIERT_AUF_FK2 on OPERATION_DIAGNOSE (
   DIAGNOSE_ID ASC
)
/

/*==============================================================*/
/* Table: PATIENT                                               */
/*==============================================================*/
create table PATIENT (
   PATIENTEN_ID         NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   KRANKENHAUS_ID       NUMBER(1,0)           not null,
   RAUM_ID              NUMBER,
   NAME                 VARCHAR2(1024)        not null,
   AUFNAHME_DATUM       DATE                  not null,
   ENTLASSUNGS_DATUM    DATE,
   GESCHLECHT           NUMBER(1,0)           not null
      constraint CKC_GESCHLECHT_PATIENT check (GESCHLECHT between 0 and 2),
   GEBURTSDATUM         DATE                  not null,
   BLUTGRUPPE           VARCHAR2(1024),
   constraint PK_PATIENT primary key (PATIENTEN_ID)
)
/

comment on column PATIENT.PATIENTEN_ID is
'Primärschlüssel'
/

comment on column PATIENT.KRANKENHAUS_ID is
'Sekundärschlüssel, In welchem Krankenhaus sich der Patient befindet'
/

comment on column PATIENT.RAUM_ID is
'Sekundärschlüssel. In welchem Raum sich der Patient befindet'
/

comment on column PATIENT.NAME is
'Name des Patienten (Vor- und Nachname)'
/

comment on column PATIENT.AUFNAHME_DATUM is
'Letzte Aufnahmedatum'
/

comment on column PATIENT.ENTLASSUNGS_DATUM is
'Letztes Entlassungsdatum'
/

comment on column PATIENT.GESCHLECHT is
'Geschlecht des Patienten (M = 0/W = 1/D = 2)'
/

comment on column PATIENT.GEBURTSDATUM is
'Geburtstag des Patienten'
/

comment on column PATIENT.BLUTGRUPPE is
'Blutgruppe des Patienten (0,A,B,AB)'
/

/*==============================================================*/
/* Index: "1_FK"                                                */
/*==============================================================*/
create index "1_FK" on PATIENT (
   KRANKENHAUS_ID ASC
)
/

/*==============================================================*/
/* Index: RELATIONSHIP_23_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_23_FK on PATIENT (
   RAUM_ID ASC
)
/

/*==============================================================*/
/* Table: PATIENTENRAUM                                         */
/*==============================================================*/
create table PATIENTENRAUM (
   PATIENTENRAUM_ID     NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   STATIONS_ID          NUMBER                not null,
   RAUM_NR              NUMBER                not null,
   BETTKAPAZITAET       NUMBER                not null,
   constraint PK_PATIENTENRAUM primary key (PATIENTENRAUM_ID)
)
/

comment on column PATIENTENRAUM.PATIENTENRAUM_ID is
'Primärschlüssel'
/

comment on column PATIENTENRAUM.STATIONS_ID is
'Sekundärschlüssel. In welcher Station befindet sich der Raum'
/

comment on column PATIENTENRAUM.RAUM_NR is
'Die Raumnummer'
/

comment on column PATIENTENRAUM.BETTKAPAZITAET is
'Wie viele Betten gibt es im Raum'
/

/*==============================================================*/
/* Index: RELATIONSHIP_6_FK2                                    */
/*==============================================================*/
create index RELATIONSHIP_6_FK2 on PATIENTENRAUM (
   STATIONS_ID ASC
)
/

/*==============================================================*/
/* Table: PATIENT_VERSICHERUNG                                  */
/*==============================================================*/
create table PATIENT_VERSICHERUNG (
   PATIENTEN_ID         NUMBER                not null,
   BETRIEBSNUMMER       NUMBER                not null,
   VERSICHERUNGSNUMMER  NUMBER,
   constraint PK_PATIENT_VERSICHERUNG primary key (PATIENTEN_ID, BETRIEBSNUMMER)
)
/

comment on column PATIENT_VERSICHERUNG.PATIENTEN_ID is
'Primärschlüssel'
/

comment on column PATIENT_VERSICHERUNG.BETRIEBSNUMMER is
'Primärschlüssel'
/

/*==============================================================*/
/* Table: RECHNUNG                                              */
/*==============================================================*/
create table RECHNUNG (
   RECHNUNGS_NR         NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   PATIENTEN_ID         NUMBER                not null,
   BETRIEBSNUMMER       NUMBER                not null,
   BETRAG               NUMBER(8,2)           not null,
   ZUZAHLUNG            NUMBER(8,2),
   AUSSTELLUNGS_DATUM   DATE,
   FAELLIGKEITS_DATUM   DATE,
   STATUS               NUMBER(1,0)          default 1
      constraint CKC_STATUS_RECHNUNG check (STATUS is null or (STATUS between 0 and 1)),
   constraint PK_RECHNUNG primary key (RECHNUNGS_NR)
)
/

comment on column RECHNUNG.RECHNUNGS_NR is
'Primärschlüssel'
/

comment on column RECHNUNG.PATIENTEN_ID is
'Sekundärschlüssel. Welchem Patienten die Rechnung zugeordnet ist'
/

comment on column RECHNUNG.BETRIEBSNUMMER is
'Sekundärschlüssel. Welcher Versicherung die Rechnung zugeordnet ist'
/

comment on column RECHNUNG.BETRAG is
'Der zu zahlende Betrag für die Versicherung'
/

comment on column RECHNUNG.ZUZAHLUNG is
'Die Zuzahlung von dem Patienten'
/

comment on column RECHNUNG.AUSSTELLUNGS_DATUM is
'Datum wann die Rechnung der Versicherung ausgestellt wurde'
/

comment on column RECHNUNG.FAELLIGKEITS_DATUM is
'Datum wann die Rechnung spätestens beglichen werden muss'
/

comment on column RECHNUNG.STATUS is
'0 = Rechnung beglichen 1 = Rechnung nicht beglichen'
/

/*==============================================================*/
/* Index: RELATIONSHIP_21_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_21_FK on RECHNUNG (
   PATIENTEN_ID ASC
)
/

/*==============================================================*/
/* Index: RELATIONSHIP_22_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_22_FK on RECHNUNG (
   BETRIEBSNUMMER ASC
)
/

/*==============================================================*/
/* Table: STATION                                               */
/*==============================================================*/
create table STATION (
   STATIONS_ID          NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   KRANKENHAUS_ID       NUMBER(1,0)           not null,
   NOTFALLSTATION       NUMBER(1,0)          default 0  not null
      constraint CKC_NOTFALLSTATION_STATION check (NOTFALLSTATION between 0 and 1),
   STATIONS_NAME        VARCHAR2(50)          not null,
   constraint PK_STATION primary key (STATIONS_ID)
)
/

comment on column STATION.STATIONS_ID is
'Primärschlüssel'
/

comment on column STATION.KRANKENHAUS_ID is
'Sekundärschlüssel. Zu welchem Krankenhaus gehört die Station'
/

comment on column STATION.NOTFALLSTATION is
'Ist die Station für Notfälle. 0 = Nein 1 = Ja'
/

comment on column STATION.STATIONS_NAME is
'Bezeichnung der Station'
/

/*==============================================================*/
/* Index: RELATIONSHIP_7_FK                                     */
/*==============================================================*/
create index RELATIONSHIP_7_FK on STATION (
   KRANKENHAUS_ID ASC
)
/

/*==============================================================*/
/* Table: STATION_ARZT                                          */
/*==============================================================*/
create table STATION_ARZT (
   MITARBEITER_NR       NUMBER                not null,
   STATIONS_ID          NUMBER                not null,
   constraint PK_STATION_ARZT primary key (MITARBEITER_NR, STATIONS_ID)
)
/

comment on column STATION_ARZT.MITARBEITER_NR is
'Primärschlüssel'
/

comment on column STATION_ARZT.STATIONS_ID is
'Primärschlüssel'
/

/*==============================================================*/
/* Index: GELEITET_VON_FK                                       */
/*==============================================================*/
create index GELEITET_VON_FK on STATION_ARZT (
   MITARBEITER_NR ASC
)
/

/*==============================================================*/
/* Index: ZUGEORDNET_FK                                         */
/*==============================================================*/
create index ZUGEORDNET_FK on STATION_ARZT (
   STATIONS_ID ASC
)
/

/*==============================================================*/
/* Table: STATION_KRANKENPFLEGER                                */
/*==============================================================*/
create table STATION_KRANKENPFLEGER (
   MITARBEITER_NR       NUMBER                not null,
   STATIONS_ID          NUMBER                not null,
   constraint PK_STATION_KRANKENPFLEGER primary key (MITARBEITER_NR, STATIONS_ID)
)
/

comment on column STATION_KRANKENPFLEGER.MITARBEITER_NR is
'Primärschlüssel'
/

comment on column STATION_KRANKENPFLEGER.STATIONS_ID is
'Primärschlüssel'
/

/*==============================================================*/
/* Index: GELEITET_VON_FK2                                      */
/*==============================================================*/
create index GELEITET_VON_FK2 on STATION_KRANKENPFLEGER (
   MITARBEITER_NR ASC
)
/

/*==============================================================*/
/* Index: ZUGEORDNET_FK2                                        */
/*==============================================================*/
create index ZUGEORDNET_FK2 on STATION_KRANKENPFLEGER (
   STATIONS_ID ASC
)
/

/*==============================================================*/
/* Table: THERAPIE                                              */
/*==============================================================*/
create table THERAPIE (
   BEHANDLUNGS_ID       NUMBER              
      generated always as identity ( start with 1 increment by 1 nocycle noorder)  not null,
   BEZEICHNUNG          CHAR(256)             not null,
   INFO                 VARCHAR2(1024),
   BERECHTIGUNGSSTUFE   NUMBER(1,0)           not null
      constraint CKC_BERECHTIGUNGSSTUF_THERAPIE check (BERECHTIGUNGSSTUFE between 1 and 3),
   STARTZEIT            DATE                  not null,
   ENDZEIT              DATE                  not null,
   constraint PK_THERAPIE primary key (BEHANDLUNGS_ID)
)
/

comment on column THERAPIE.BEHANDLUNGS_ID is
'Primärschlüssel'
/

comment on column THERAPIE.BEZEICHNUNG is
'Oberbegriff für die Behandlung
'
/

comment on column THERAPIE.INFO is
'Weitere Informationen zur Behandlung'
/

comment on column THERAPIE.BERECHTIGUNGSSTUFE is
'Die Berechtigungsstufe die Mitarbeiter benötigen, um die Behandlung durchzuführen '
/

comment on column THERAPIE.STARTZEIT is
'Datum wann die Behandlung beginnt'
/

comment on column THERAPIE.ENDZEIT is
'Voraussichtliche Beendigung der Behandlung
'
/

/*==============================================================*/
/* Table: THERAPIE_DIAGNOSE                                     */
/*==============================================================*/
create table THERAPIE_DIAGNOSE (
   BEHANDLUNGS_ID       NUMBER                not null,
   DIAGNOSE_ID          NUMBER                not null,
   constraint PK_THERAPIE_DIAGNOSE primary key (BEHANDLUNGS_ID, DIAGNOSE_ID)
)
/

comment on column THERAPIE_DIAGNOSE.BEHANDLUNGS_ID is
'Primärschlüssel'
/

comment on column THERAPIE_DIAGNOSE.DIAGNOSE_ID is
'Primärschlüssel'
/

/*==============================================================*/
/* Index: VERANLASST_FK                                         */
/*==============================================================*/
create index VERANLASST_FK on THERAPIE_DIAGNOSE (
   BEHANDLUNGS_ID ASC
)
/

/*==============================================================*/
/* Index: BASIERT_AUF_FK                                        */
/*==============================================================*/
create index BASIERT_AUF_FK on THERAPIE_DIAGNOSE (
   DIAGNOSE_ID ASC
)
/

/*==============================================================*/
/* Table: VERSICHERUNG                                          */
/*==============================================================*/
create table VERSICHERUNG (
   BETRIEBSNUMMER       NUMBER                not null,
   VERSICHERUNGSNAME    VARCHAR2(1024)        not null,
   constraint PK_VERSICHERUNG primary key (BETRIEBSNUMMER)
)
/

comment on column VERSICHERUNG.BETRIEBSNUMMER is
'Primärschlüssel'
/

comment on column VERSICHERUNG.VERSICHERUNGSNAME is
'Name der Versicherung'
/

alter table PATIENT_VERSICHERUNG
   add constraint FK_PATIENT__REFERENCE_PATIENT foreign key (PATIENTEN_ID)
      references PATIENT (PATIENTEN_ID)
/

alter table PATIENT_VERSICHERUNG
   add constraint FK_PATIENT__REFERENCE_VERSICHE foreign key (BETRIEBSNUMMER)
      references VERSICHERUNG (BETRIEBSNUMMER)
/


create or replace trigger COMPOUNDDELETETRIGGER_ARZT
for delete on ARZT compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_ARZT
for insert on ARZT compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_ARZT
for update on ARZT compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_DIAGNOSE
for delete on DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_DIAGNOSE
for insert on DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_DIAGNOSE
for update on DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_KRANKENH
for delete on KRANKENHAUS compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_KRANKENH
for insert on KRANKENHAUS compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_KRANKENH
for update on KRANKENHAUS compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_KRANKENP
for delete on KRANKENPFLEGER compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_KRANKENP
for insert on KRANKENPFLEGER compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_KRANKENP
for update on KRANKENPFLEGER compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_LAGERRAU
for delete on LAGERRAUM compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_LAGERRAU
for insert on LAGERRAUM compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_LAGERRAU
for update on LAGERRAUM compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_OPERATIO
for delete on OPERATION compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_OPERATIO
for insert on OPERATION compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_OPERATIO
for update on OPERATION compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_OPERATIO
for delete on OPERATIONSSAAL compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_OPERATIO
for insert on OPERATIONSSAAL compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_OPERATIO
for update on OPERATIONSSAAL compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_RELATION
for delete on OPERATION_DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_RELATION
for insert on OPERATION_DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_RELATION
for update on OPERATION_DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_PATIENTE
for delete on PATIENTENRAUM compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_PATIENTE
for insert on PATIENTENRAUM compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_PATIENTE
for update on PATIENTENRAUM compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_STATION
for delete on STATION compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_STATION
for insert on STATION compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_STATION
for update on STATION compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_RELATION
for delete on STATION_ARZT compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_RELATION
for insert on STATION_ARZT compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_RELATION
for update on STATION_ARZT compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_RELATION
for delete on STATION_KRANKENPFLEGER compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_RELATION
for insert on STATION_KRANKENPFLEGER compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_RELATION
for update on STATION_KRANKENPFLEGER compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_THERAPIE
for delete on THERAPIE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_THERAPIE
for insert on THERAPIE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_THERAPIE
for update on THERAPIE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDDELETETRIGGER_RELATION
for delete on THERAPIE_DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDINSERTTRIGGER_RELATION
for insert on THERAPIE_DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/


create or replace trigger COMPOUNDUPDATETRIGGER_RELATION
for update on THERAPIE_DIAGNOSE compound trigger
// Declaration
// Body
  before statement is
  begin
     NULL;
  end before statement;

  before each row is
  begin
     NULL;
  end before each row;

  after each row is
  begin
     NULL;
  end after each row;

  after statement is
  begin
     NULL;
  end after statement;

END
/

