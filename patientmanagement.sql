/*==============================================================*/
/* DBMS name:      ORACLE Version 19c                           */
/* Created on:     18.12.2023 19:23:05                          */
/*==============================================================*/


alter table ARZT
   drop constraint FK_ARZT_RELATIONS_KRANKENH;

alter table ARZT_OPERATION
   drop constraint FK_ARZT_OPE_DURCHGEFU_ARZT;

alter table ARZT_OPERATION
   drop constraint FK_ARZT_OPE_FUHRT_DUR_OPERATIO;

alter table ARZT_THERAPIE
   drop constraint FK_ARZT_THE_DURCHGEFU_ARZT;

alter table ARZT_THERAPIE
   drop constraint FK_ARZT_THE_FUHRT_DUR_THERAPIE;

alter table DIAGNOSE
   drop constraint FK_DIAGNOSE_RELATIONS_ARZT;

alter table KRANKENPFLEGER
   drop constraint FK_KRANKENP_RELATIONS_KRANKENH;

alter table KRANKENPFLEGER_ARZT
   drop constraint FK_KRANKENP_DURCHGEFU_KRANKENP;

alter table KRANKENPFLEGER_ARZT
   drop constraint FK_KRANKENP_FUHRT_DUR_OPERATIO;

alter table KRANKENPFLEGER_THERAPIE
   drop constraint FK_KRANKENP_DURCHGEFU_KRANKEN2;

alter table KRANKENPFLEGER_THERAPIE
   drop constraint FK_KRANKENP_FUHRT_DUR_THERAPIE;

alter table LAGERRAUM
   drop constraint FK_LAGERRAU_RELATIONS_STATION;

alter table MEDIKAMENT
   drop constraint FK_MEDIKAME_RELATIONS_LAGERRAU;

alter table OPERATION
   drop constraint FK_OPERATIO_RELATIONS_OPERATIO;

alter table OPERATIONSSAAL
   drop constraint FK_OPERATIO_RELATIONS_STATION;

alter table OPERATION_DIAGNOSE
   drop constraint FK_OPERATIO_BASIERT_A_DIAGNOSE;

alter table OPERATION_DIAGNOSE
   drop constraint FK_OPERATIO_VERANLASS_OPERATIO;

alter table PATIENT
   drop constraint FK_PATIENT_1_KRANKENH;

alter table PATIENT
   drop constraint FK_PATIENT_RELATIONS_PATIENTE;

alter table PATIENT
   drop constraint FK_PATIENT_RELATIONS_DIAGNOSE;

alter table PATIENTENRAUM
   drop constraint FK_PATIENTE_RELATIONS_STATION;

alter table PATIENT_VERSICHERUNG
   drop constraint "FK_PATIENT__IST VERSI_VERSICHE";

alter table PATIENT_VERSICHERUNG
   drop constraint FK_PATIENT__VERSICHER_PATIENT;

alter table RECHNUNG
   drop constraint FK_RECHNUNG_RELATIONS_PATIENT;

alter table RECHNUNG
   drop constraint FK_RECHNUNG_RELATIONS_VERSICHE;

alter table STATION
   drop constraint FK_STATION_RELATIONS_KRANKENH;

alter table STATION_ARZT
   drop constraint FK_STATION__GELEITET__ARZT;

alter table STATION_ARZT
   drop constraint FK_STATION__ZUGEORDNE_STATION;

alter table STATION_KRANKENPFLEGER
   drop constraint FK_STATION__GELEITET__KRANKENP;

alter table STATION_KRANKENPFLEGER
   drop constraint FK_STATION__ZUGEORDNE_STATION2;

alter table THERAPIE_DIAGNOSE
   drop constraint FK_THERAPIE_BASIERT_A_DIAGNOSE;

alter table THERAPIE_DIAGNOSE
   drop constraint FK_THERAPIE_VERANLASS_THERAPIE;

drop index RELATIONSHIP_8_FK2;

drop table ARZT cascade constraints;

drop index DURCHGEFUHRT_VON_FK4;

drop index FUHRT_DURCH_FK6;

drop table ARZT_OPERATION cascade constraints;

drop index DURCHGEFUHRT_VON_FK2;

drop index FUHRT_DURCH_FK3;

drop table ARZT_THERAPIE cascade constraints;

drop index RELATIONSHIP_26_FK;

drop table DIAGNOSE cascade constraints;

drop table KRANKENHAUS cascade constraints;

drop index RELATIONSHIP_8_FK;

drop table KRANKENPFLEGER cascade constraints;

drop index DURCHGEFUHRT_VON_FK3;

drop index FUHRT_DURCH_FK5;

drop table KRANKENPFLEGER_ARZT cascade constraints;

drop index DURCHGEFUHRT_VON_FK;

drop index FUHRT_DURCH_FK2;

drop table KRANKENPFLEGER_THERAPIE cascade constraints;

drop index RELATIONSHIP_6_FK;

drop table LAGERRAUM cascade constraints;

drop index RELATIONSHIP_11_FK;

drop table MEDIKAMENT cascade constraints;

drop index RELATIONSHIP_16_FK;

drop table OPERATION cascade constraints;

drop index RELATIONSHIP_6_FK3;

drop table OPERATIONSSAAL cascade constraints;

drop index BASIERT_AUF_FK2;

drop index VERANLASST_FK2;

drop table OPERATION_DIAGNOSE cascade constraints;

drop index RELATIONSHIP_25_FK;

drop index RELATIONSHIP_23_FK;

drop index "1_FK";

drop table PATIENT cascade constraints;

drop index RELATIONSHIP_6_FK2;

drop table PATIENTENRAUM cascade constraints;

drop index VERSICHERT_FK;

drop index IST_VERSICHERT_FK;

drop table PATIENT_VERSICHERUNG cascade constraints;

drop index RELATIONSHIP_22_FK;

drop index RELATIONSHIP_21_FK;

drop table RECHNUNG cascade constraints;

drop index RELATIONSHIP_7_FK;

drop table STATION cascade constraints;

drop index ZUGEORDNET_FK2;

drop index GELEITET_VON_FK2;

drop table STATION_ARZT cascade constraints;

drop index ZUGEORDNET_FK;

drop index GELEITET_VON_FK;

drop table STATION_KRANKENPFLEGER cascade constraints;

drop table THERAPIE cascade constraints;

drop index BASIERT_AUF_FK;

drop index VERANLASST_FK;

drop table THERAPIE_DIAGNOSE cascade constraints;

drop table VERSICHERUNG cascade constraints;

/*==============================================================*/
/* Table: ARZT                                                  */
/*==============================================================*/
create table ARZT (
   MITARBEITER_NR       INTEGER             
      generated always as identity ( start with 1 increment by 1 minvalue 1 nocycle noorder)  not null
      constraint CKC_MITARBEITER_NR_ARZT check (MITARBEITER_NR >= 1),
   KRANKENHAUS_ID       INTEGER               not null,
   NAME                 CHAR(256)             not null,
   VORNAME              CHAR(256)             not null,
   ARBEITSBEGINN        DATE                  not null,
   ARBEITSENDE          DATE                  not null,
   FACHRICHTUNG         CHAR(256)             not null,
   POSITION             CHAR(256)             not null,
   constraint PK_ARZT primary key (MITARBEITER_NR)
);

/*==============================================================*/
/* Index: RELATIONSHIP_8_FK2                                    */
/*==============================================================*/
create index RELATIONSHIP_8_FK2 on ARZT (
   KRANKENHAUS_ID ASC
);

/*==============================================================*/
/* Table: ARZT_OPERATION                                        */
/*==============================================================*/
create table ARZT_OPERATION (
   BEHANDLUNGS_ID       INTEGER               not null,
   MITARBEITER_NR       INTEGER               not null,
   constraint PK_ARZT_OPERATION primary key (BEHANDLUNGS_ID, MITARBEITER_NR)
);

/*==============================================================*/
/* Index: FUHRT_DURCH_FK6                                       */
/*==============================================================*/
create index FUHRT_DURCH_FK6 on ARZT_OPERATION (
   BEHANDLUNGS_ID ASC
);

/*==============================================================*/
/* Index: DURCHGEFUHRT_VON_FK4                                  */
/*==============================================================*/
create index DURCHGEFUHRT_VON_FK4 on ARZT_OPERATION (
   MITARBEITER_NR ASC
);

/*==============================================================*/
/* Table: ARZT_THERAPIE                                         */
/*==============================================================*/
create table ARZT_THERAPIE (
   BEHANDLUNGS_ID       INTEGER               not null,
   MITARBEITER_NR       INTEGER               not null,
   constraint PK_ARZT_THERAPIE primary key (BEHANDLUNGS_ID, MITARBEITER_NR)
);

/*==============================================================*/
/* Index: FUHRT_DURCH_FK3                                       */
/*==============================================================*/
create index FUHRT_DURCH_FK3 on ARZT_THERAPIE (
   BEHANDLUNGS_ID ASC
);

/*==============================================================*/
/* Index: DURCHGEFUHRT_VON_FK2                                  */
/*==============================================================*/
create index DURCHGEFUHRT_VON_FK2 on ARZT_THERAPIE (
   MITARBEITER_NR ASC
);

/*==============================================================*/
/* Table: DIAGNOSE                                              */
/*==============================================================*/
create table DIAGNOSE (
   DIAGNOSE_ID          INTEGER             
      generated always as identity ( start with 1 increment by 1 minvalue 1 nocycle noorder)  not null
      constraint CKC_DIAGNOSE_ID_DIAGNOSE check (DIAGNOSE_ID >= 1),
   MITARBEITER_NR       INTEGER               not null,
   DIAGNOSE_DATUM       DATE                  not null,
   BESCHREIBUNG         VARCHAR2(1024)        not null,
   STATUS               SMALLINT             default 0  not null
      constraint CKC_STATUS_DIAGNOSE check (STATUS between 0 and 1),
   constraint PK_DIAGNOSE primary key (DIAGNOSE_ID)
);

comment on column DIAGNOSE.STATUS is
'0 = Behandlung abgeschlossen
1 = nicht behandelt';

/*==============================================================*/
/* Index: RELATIONSHIP_26_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_26_FK on DIAGNOSE (
   MITARBEITER_NR ASC
);

/*==============================================================*/
/* Table: KRANKENHAUS                                           */
/*==============================================================*/
create table KRANKENHAUS (
   KRANKENHAUS_ID       INTEGER             
      generated always as identity ( start with 1 increment by 1 maxvalue 5 minvalue 1 nocycle noorder)  not null
      constraint CKC_KRANKENHAUS_ID_KRANKENH check (KRANKENHAUS_ID between 1 and 5),
   STADT                CHAR(256)             not null,
   ADRESSE              VARCHAR2(1024)        not null,
   NAME                 CHAR(256)             not null,
   constraint PK_KRANKENHAUS primary key (KRANKENHAUS_ID)
);

/*==============================================================*/
/* Table: KRANKENPFLEGER                                        */
/*==============================================================*/
create table KRANKENPFLEGER (
   MITARBEITER_NR       INTEGER             
      generated always as identity ( start with 1 increment by 1 minvalue 1 nocycle noorder)  not null
      constraint CKC_MITARBEITER_NR_KRANKENP check (MITARBEITER_NR >= 1),
   KRANKENHAUS_ID       INTEGER               not null,
   NAME                 CHAR(256)             not null,
   VORNAME              CHAR(256)             not null,
   ARBEITSBEGINN        DATE                  not null,
   ARBEITSENDE          DATE                  not null,
   QUALIFIKATIONEN      VARCHAR2(1024)        not null,
   BERECHTIGUNGEN       INTEGER               not null,
   constraint PK_KRANKENPFLEGER primary key (MITARBEITER_NR)
);

/*==============================================================*/
/* Index: RELATIONSHIP_8_FK                                     */
/*==============================================================*/
create index RELATIONSHIP_8_FK on KRANKENPFLEGER (
   KRANKENHAUS_ID ASC
);

/*==============================================================*/
/* Table: KRANKENPFLEGER_ARZT                                   */
/*==============================================================*/
create table KRANKENPFLEGER_ARZT (
   BEHANDLUNGS_ID       INTEGER               not null,
   MITARBEITER_NR       INTEGER               not null,
   constraint PK_KRANKENPFLEGER_ARZT primary key (BEHANDLUNGS_ID, MITARBEITER_NR)
);

/*==============================================================*/
/* Index: FUHRT_DURCH_FK5                                       */
/*==============================================================*/
create index FUHRT_DURCH_FK5 on KRANKENPFLEGER_ARZT (
   BEHANDLUNGS_ID ASC
);

/*==============================================================*/
/* Index: DURCHGEFUHRT_VON_FK3                                  */
/*==============================================================*/
create index DURCHGEFUHRT_VON_FK3 on KRANKENPFLEGER_ARZT (
   MITARBEITER_NR ASC
);

/*==============================================================*/
/* Table: KRANKENPFLEGER_THERAPIE                               */
/*==============================================================*/
create table KRANKENPFLEGER_THERAPIE (
   BEHANDLUNGS_ID       INTEGER               not null,
   MITARBEITER_NR       INTEGER               not null,
   constraint PK_KRANKENPFLEGER_THERAPIE primary key (BEHANDLUNGS_ID, MITARBEITER_NR)
);

/*==============================================================*/
/* Index: FUHRT_DURCH_FK2                                       */
/*==============================================================*/
create index FUHRT_DURCH_FK2 on KRANKENPFLEGER_THERAPIE (
   BEHANDLUNGS_ID ASC
);

/*==============================================================*/
/* Index: DURCHGEFUHRT_VON_FK                                   */
/*==============================================================*/
create index DURCHGEFUHRT_VON_FK on KRANKENPFLEGER_THERAPIE (
   MITARBEITER_NR ASC
);

/*==============================================================*/
/* Table: LAGERRAUM                                             */
/*==============================================================*/
create table LAGERRAUM (
   RAUM_NR              VARCHAR2(1024)        not null,
   STATIONS_ID          VARCHAR2(1024)        not null,
   LAGERKAPAZITAET      INTEGER               not null,
   constraint PK_LAGERRAUM primary key (RAUM_NR)
);

/*==============================================================*/
/* Index: RELATIONSHIP_6_FK                                     */
/*==============================================================*/
create index RELATIONSHIP_6_FK on LAGERRAUM (
   STATIONS_ID ASC
);

/*==============================================================*/
/* Table: MEDIKAMENT                                            */
/*==============================================================*/
create table MEDIKAMENT (
   MEDIKAMENTEN_NR      INTEGER               not null,
   RAUM_NR              VARCHAR2(1024)        not null,
   NAME                 CHAR(256)             not null,
   INFO                 CLOB,
   ALLERGEN             VARCHAR2(1024),
   BESTELLSTATUS        SMALLINT             default 0  not null
      constraint CKC_BESTELLSTATUS_MEDIKAME check (BESTELLSTATUS between 0 and 1),
   constraint PK_MEDIKAMENT primary key (MEDIKAMENTEN_NR)
);

comment on column MEDIKAMENT.BESTELLSTATUS is
'0 = nicht in Bestellung
1 = in Bestellung
';

/*==============================================================*/
/* Index: RELATIONSHIP_11_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_11_FK on MEDIKAMENT (
   RAUM_NR ASC
);

/*==============================================================*/
/* Table: OPERATION                                             */
/*==============================================================*/
create table OPERATION (
   BEHANDLUNGS_ID       INTEGER             
      generated always as identity ( start with 1 increment by 1 minvalue 1 nocycle noorder)  not null
      constraint CKC_BEHANDLUNGS_ID_OPERATIO check (BEHANDLUNGS_ID >= 1),
   RAUM_NR              VARCHAR2(1024)        not null,
   BEZEICHNUNG          CHAR(256)             not null,
   INFO                 VARCHAR2(1024),
   ENDZEIT              DATE,
   BEHANDLUNGSSTATUS    INTEGER               not null,
   BERECHTIGUNGSSTUFE   INTEGER,
   STARTZEIT            DATE                  not null,
   constraint PK_OPERATION primary key (BEHANDLUNGS_ID)
);

/*==============================================================*/
/* Index: RELATIONSHIP_16_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_16_FK on OPERATION (
   RAUM_NR ASC
);

/*==============================================================*/
/* Table: OPERATIONSSAAL                                        */
/*==============================================================*/
create table OPERATIONSSAAL (
   RAUM_NR              VARCHAR2(1024)        not null,
   STATIONS_ID          VARCHAR2(1024)        not null,
   PERSONENKAPAZITAET   INTEGER               not null,
   OEFFNUNGSZEIT        CHAR                  not null,
   SCHLIESSUNGSZEIT     CHAR                  not null,
   constraint PK_OPERATIONSSAAL primary key (RAUM_NR)
);

/*==============================================================*/
/* Index: RELATIONSHIP_6_FK3                                    */
/*==============================================================*/
create index RELATIONSHIP_6_FK3 on OPERATIONSSAAL (
   STATIONS_ID ASC
);

/*==============================================================*/
/* Table: OPERATION_DIAGNOSE                                    */
/*==============================================================*/
create table OPERATION_DIAGNOSE (
   BEHANDLUNGS_ID       INTEGER               not null,
   DIAGNOSE_ID          INTEGER               not null,
   constraint PK_OPERATION_DIAGNOSE primary key (BEHANDLUNGS_ID, DIAGNOSE_ID)
);

/*==============================================================*/
/* Index: VERANLASST_FK2                                        */
/*==============================================================*/
create index VERANLASST_FK2 on OPERATION_DIAGNOSE (
   BEHANDLUNGS_ID ASC
);

/*==============================================================*/
/* Index: BASIERT_AUF_FK2                                       */
/*==============================================================*/
create index BASIERT_AUF_FK2 on OPERATION_DIAGNOSE (
   DIAGNOSE_ID ASC
);

/*==============================================================*/
/* Table: PATIENT                                               */
/*==============================================================*/
create table PATIENT (
   PATIENTEN_ID         INTEGER             
      generated always as identity ( start with 1 increment by 1 minvalue 1 nocycle noorder)  not null
      constraint CKC_PATIENTEN_ID_PATIENT check (PATIENTEN_ID >= 1),
   DIAGNOSE_ID          INTEGER,
   KRANKENHAUS_ID       INTEGER               not null,
   RAUM_NR              VARCHAR2(1024),
   VERSICHERUNGS_NR     INTEGER               not null,
   NAME                 VARCHAR2(1024)        not null,
   AUFNAHME_DATUM       DATE                  not null,
   ENTLASSUNGS_DATUM    DATE,
   GESCHLECHT           SMALLINT              not null
      constraint CKC_GESCHLECHT_PATIENT check (GESCHLECHT between 0 and 1),
   GEBURTSDATUM         DATE                  not null,
   BLUTGRUPPE           VARCHAR2(1024),
   constraint PK_PATIENT primary key (PATIENTEN_ID)
);

comment on column PATIENT.GESCHLECHT is
'0 = männlich
1 = weiblich';

/*==============================================================*/
/* Index: "1_FK"                                                */
/*==============================================================*/
create index "1_FK" on PATIENT (
   KRANKENHAUS_ID ASC
);

/*==============================================================*/
/* Index: RELATIONSHIP_23_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_23_FK on PATIENT (
   RAUM_NR ASC
);

/*==============================================================*/
/* Index: RELATIONSHIP_25_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_25_FK on PATIENT (
   DIAGNOSE_ID ASC
);

/*==============================================================*/
/* Table: PATIENTENRAUM                                         */
/*==============================================================*/
create table PATIENTENRAUM (
   RAUM_NR              VARCHAR2(1024)        not null,
   STATIONS_ID          VARCHAR2(1024)        not null,
   BETTKAPAZITAET       INTEGER               not null,
   constraint PK_PATIENTENRAUM primary key (RAUM_NR)
);

/*==============================================================*/
/* Index: RELATIONSHIP_6_FK2                                    */
/*==============================================================*/
create index RELATIONSHIP_6_FK2 on PATIENTENRAUM (
   STATIONS_ID ASC
);

/*==============================================================*/
/* Table: PATIENT_VERSICHERUNG                                  */
/*==============================================================*/
create table PATIENT_VERSICHERUNG (
   ATTRIBUTE_6          INTEGER               not null,
   PATIENTEN_ID         INTEGER               not null,
   VERSICHERUNGSNUMMER  INTEGER,
   constraint PK_PATIENT_VERSICHERUNG primary key (ATTRIBUTE_6, PATIENTEN_ID)
);

/*==============================================================*/
/* Index: IST_VERSICHERT_FK                                     */
/*==============================================================*/
create index IST_VERSICHERT_FK on PATIENT_VERSICHERUNG (
   ATTRIBUTE_6 ASC
);

/*==============================================================*/
/* Index: VERSICHERT_FK                                         */
/*==============================================================*/
create index VERSICHERT_FK on PATIENT_VERSICHERUNG (
   PATIENTEN_ID ASC
);

/*==============================================================*/
/* Table: RECHNUNG                                              */
/*==============================================================*/
create table RECHNUNG (
   RECHNUNGS_NR         INTEGER             
      generated always as identity ( start with 1 increment by 1 minvalue 1 nocycle noorder)  not null
      constraint CKC_RECHNUNGS_NR_RECHNUNG check (RECHNUNGS_NR >= 1),
   PATIENTEN_ID         INTEGER               not null,
   ATTRIBUTE_6          INTEGER               not null,
   BETRAG               NUMBER(8,0)           not null,
   ZUZAHLUNG            NUMBER(8,0),
   constraint PK_RECHNUNG primary key (RECHNUNGS_NR)
);

/*==============================================================*/
/* Index: RELATIONSHIP_21_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_21_FK on RECHNUNG (
   PATIENTEN_ID ASC
);

/*==============================================================*/
/* Index: RELATIONSHIP_22_FK                                    */
/*==============================================================*/
create index RELATIONSHIP_22_FK on RECHNUNG (
   ATTRIBUTE_6 ASC
);

/*==============================================================*/
/* Table: STATION                                               */
/*==============================================================*/
create table STATION (
   STATIONS_ID          VARCHAR2(1024)        not null,
   KRANKENHAUS_ID       INTEGER               not null,
   NOTFALLSTATION       SMALLINT             default 0  not null
      constraint CKC_NOTFALLSTATION_STATION check (NOTFALLSTATION between 0 and 1),
   constraint PK_STATION primary key (STATIONS_ID)
);

comment on column STATION.NOTFALLSTATION is
'0 = keine Notfallstation
1 = Notfallstation


';

/*==============================================================*/
/* Index: RELATIONSHIP_7_FK                                     */
/*==============================================================*/
create index RELATIONSHIP_7_FK on STATION (
   KRANKENHAUS_ID ASC
);

/*==============================================================*/
/* Table: STATION_ARZT                                          */
/*==============================================================*/
create table STATION_ARZT (
   MITARBEITER_NR       INTEGER               not null,
   STATIONS_ID          VARCHAR2(1024)        not null,
   constraint PK_STATION_ARZT primary key (MITARBEITER_NR, STATIONS_ID)
);

/*==============================================================*/
/* Index: GELEITET_VON_FK2                                      */
/*==============================================================*/
create index GELEITET_VON_FK2 on STATION_ARZT (
   MITARBEITER_NR ASC
);

/*==============================================================*/
/* Index: ZUGEORDNET_FK2                                        */
/*==============================================================*/
create index ZUGEORDNET_FK2 on STATION_ARZT (
   STATIONS_ID ASC
);

/*==============================================================*/
/* Table: STATION_KRANKENPFLEGER                                */
/*==============================================================*/
create table STATION_KRANKENPFLEGER (
   MITARBEITER_NR       INTEGER               not null,
   STATIONS_ID          VARCHAR2(1024)        not null,
   constraint PK_STATION_KRANKENPFLEGER primary key (MITARBEITER_NR, STATIONS_ID)
);

/*==============================================================*/
/* Index: GELEITET_VON_FK                                       */
/*==============================================================*/
create index GELEITET_VON_FK on STATION_KRANKENPFLEGER (
   MITARBEITER_NR ASC
);

/*==============================================================*/
/* Index: ZUGEORDNET_FK                                         */
/*==============================================================*/
create index ZUGEORDNET_FK on STATION_KRANKENPFLEGER (
   STATIONS_ID ASC
);

/*==============================================================*/
/* Table: THERAPIE                                              */
/*==============================================================*/
create table THERAPIE (
   BEHANDLUNGS_ID       INTEGER             
      generated always as identity ( start with 1 increment by 1 minvalue 1 nocycle noorder)  not null
      constraint CKC_BEHANDLUNGS_ID_THERAPIE check (BEHANDLUNGS_ID >= 1),
   ART                  CHAR(256)             not null,
   UMFANG               CLOB                  not null,
   BEZEICHNUNG          CHAR(256)             not null,
   INFO                 VARCHAR2(1024),
   STARTZEITPUNKT_      DATE,
   BEHANDLUNGSSTATUS    INTEGER               not null,
   BERECHTIGUNGSSTUFE   INTEGER,
   ENDZEITPUNKT         DATE,
   constraint PK_THERAPIE primary key (BEHANDLUNGS_ID)
);

/*==============================================================*/
/* Table: THERAPIE_DIAGNOSE                                     */
/*==============================================================*/
create table THERAPIE_DIAGNOSE (
   BEHANDLUNGS_ID       INTEGER               not null,
   DIAGNOSE_ID          INTEGER               not null,
   constraint PK_THERAPIE_DIAGNOSE primary key (BEHANDLUNGS_ID, DIAGNOSE_ID)
);

/*==============================================================*/
/* Index: VERANLASST_FK                                         */
/*==============================================================*/
create index VERANLASST_FK on THERAPIE_DIAGNOSE (
   BEHANDLUNGS_ID ASC
);

/*==============================================================*/
/* Index: BASIERT_AUF_FK                                        */
/*==============================================================*/
create index BASIERT_AUF_FK on THERAPIE_DIAGNOSE (
   DIAGNOSE_ID ASC
);

/*==============================================================*/
/* Table: VERSICHERUNG                                          */
/*==============================================================*/
create table VERSICHERUNG (
   ATTRIBUTE_6          INTEGER               not null,
   VERSICHERUNGSNAME    VARCHAR2(1024)        not null,
   constraint PK_VERSICHERUNG primary key (ATTRIBUTE_6)
);

alter table ARZT
   add constraint FK_ARZT_RELATIONS_KRANKENH foreign key (KRANKENHAUS_ID)
      references KRANKENHAUS (KRANKENHAUS_ID);

alter table ARZT_OPERATION
   add constraint FK_ARZT_OPE_DURCHGEFU_ARZT foreign key (MITARBEITER_NR)
      references ARZT (MITARBEITER_NR);

alter table ARZT_OPERATION
   add constraint FK_ARZT_OPE_FUHRT_DUR_OPERATIO foreign key (BEHANDLUNGS_ID)
      references OPERATION (BEHANDLUNGS_ID);

alter table ARZT_THERAPIE
   add constraint FK_ARZT_THE_DURCHGEFU_ARZT foreign key (MITARBEITER_NR)
      references ARZT (MITARBEITER_NR);

alter table ARZT_THERAPIE
   add constraint FK_ARZT_THE_FUHRT_DUR_THERAPIE foreign key (BEHANDLUNGS_ID)
      references THERAPIE (BEHANDLUNGS_ID);

alter table DIAGNOSE
   add constraint FK_DIAGNOSE_RELATIONS_ARZT foreign key (MITARBEITER_NR)
      references ARZT (MITARBEITER_NR);

alter table KRANKENPFLEGER
   add constraint FK_KRANKENP_RELATIONS_KRANKENH foreign key (KRANKENHAUS_ID)
      references KRANKENHAUS (KRANKENHAUS_ID);

alter table KRANKENPFLEGER_ARZT
   add constraint FK_KRANKENP_DURCHGEFU_KRANKENP foreign key (MITARBEITER_NR)
      references KRANKENPFLEGER (MITARBEITER_NR);

alter table KRANKENPFLEGER_ARZT
   add constraint FK_KRANKENP_FUHRT_DUR_OPERATIO foreign key (BEHANDLUNGS_ID)
      references OPERATION (BEHANDLUNGS_ID);

alter table KRANKENPFLEGER_THERAPIE
   add constraint FK_KRANKENP_DURCHGEFU_KRANKEN2 foreign key (MITARBEITER_NR)
      references KRANKENPFLEGER (MITARBEITER_NR);

alter table KRANKENPFLEGER_THERAPIE
   add constraint FK_KRANKENP_FUHRT_DUR_THERAPIE foreign key (BEHANDLUNGS_ID)
      references THERAPIE (BEHANDLUNGS_ID);

alter table LAGERRAUM
   add constraint FK_LAGERRAU_RELATIONS_STATION foreign key (STATIONS_ID)
      references STATION (STATIONS_ID);

alter table MEDIKAMENT
   add constraint FK_MEDIKAME_RELATIONS_LAGERRAU foreign key (RAUM_NR)
      references LAGERRAUM (RAUM_NR);

alter table OPERATION
   add constraint FK_OPERATIO_RELATIONS_OPERATIO foreign key (RAUM_NR)
      references OPERATIONSSAAL (RAUM_NR);

alter table OPERATIONSSAAL
   add constraint FK_OPERATIO_RELATIONS_STATION foreign key (STATIONS_ID)
      references STATION (STATIONS_ID);

alter table OPERATION_DIAGNOSE
   add constraint FK_OPERATIO_BASIERT_A_DIAGNOSE foreign key (DIAGNOSE_ID)
      references DIAGNOSE (DIAGNOSE_ID);

alter table OPERATION_DIAGNOSE
   add constraint FK_OPERATIO_VERANLASS_OPERATIO foreign key (BEHANDLUNGS_ID)
      references OPERATION (BEHANDLUNGS_ID);

alter table PATIENT
   add constraint FK_PATIENT_1_KRANKENH foreign key (KRANKENHAUS_ID)
      references KRANKENHAUS (KRANKENHAUS_ID);

alter table PATIENT
   add constraint FK_PATIENT_RELATIONS_PATIENTE foreign key (RAUM_NR)
      references PATIENTENRAUM (RAUM_NR);

alter table PATIENT
   add constraint FK_PATIENT_RELATIONS_DIAGNOSE foreign key (DIAGNOSE_ID)
      references DIAGNOSE (DIAGNOSE_ID);

alter table PATIENTENRAUM
   add constraint FK_PATIENTE_RELATIONS_STATION foreign key (STATIONS_ID)
      references STATION (STATIONS_ID);

alter table PATIENT_VERSICHERUNG
   add constraint "FK_PATIENT__IST VERSI_VERSICHE" foreign key (ATTRIBUTE_6)
      references VERSICHERUNG (ATTRIBUTE_6);

alter table PATIENT_VERSICHERUNG
   add constraint FK_PATIENT__VERSICHER_PATIENT foreign key (PATIENTEN_ID)
      references PATIENT (PATIENTEN_ID);

alter table RECHNUNG
   add constraint FK_RECHNUNG_RELATIONS_PATIENT foreign key (PATIENTEN_ID)
      references PATIENT (PATIENTEN_ID);

alter table RECHNUNG
   add constraint FK_RECHNUNG_RELATIONS_VERSICHE foreign key (ATTRIBUTE_6)
      references VERSICHERUNG (ATTRIBUTE_6);

alter table STATION
   add constraint FK_STATION_RELATIONS_KRANKENH foreign key (KRANKENHAUS_ID)
      references KRANKENHAUS (KRANKENHAUS_ID);

alter table STATION_ARZT
   add constraint FK_STATION__GELEITET__ARZT foreign key (MITARBEITER_NR)
      references ARZT (MITARBEITER_NR);

alter table STATION_ARZT
   add constraint FK_STATION__ZUGEORDNE_STATION foreign key (STATIONS_ID)
      references STATION (STATIONS_ID);

alter table STATION_KRANKENPFLEGER
   add constraint FK_STATION__GELEITET__KRANKENP foreign key (MITARBEITER_NR)
      references KRANKENPFLEGER (MITARBEITER_NR);

alter table STATION_KRANKENPFLEGER
   add constraint FK_STATION__ZUGEORDNE_STATION2 foreign key (STATIONS_ID)
      references STATION (STATIONS_ID);

alter table THERAPIE_DIAGNOSE
   add constraint FK_THERAPIE_BASIERT_A_DIAGNOSE foreign key (DIAGNOSE_ID)
      references DIAGNOSE (DIAGNOSE_ID);

alter table THERAPIE_DIAGNOSE
   add constraint FK_THERAPIE_VERANLASS_THERAPIE foreign key (BEHANDLUNGS_ID)
      references THERAPIE (BEHANDLUNGS_ID);

