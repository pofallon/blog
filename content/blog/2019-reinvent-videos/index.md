---
title: '2019 re:Invent Videos'
date: 2020-05-02
description: "Bringing together the 2019 re:Invent videos in one place!"
image: './reinvent.png'
playlists:
  - { name: alexa, id: PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt }
  - { name: analytics, id: PL2yQDdvlhXf8xDhf0MLJbercENCI6s_8y }
  - { name: architecture, id: PL2yQDdvlhXf8_d_QOFD9Twg2LILEmluDH }
  - { name: ai, id: PL2yQDdvlhXf__-mZ2GK6BNIA3hLvvbi4E }
  - { name: community, id: PL2yQDdvlhXf-eZoV7RCaMsi0wzl9kZHBi }
  - { name: compute, id: PL2yQDdvlhXf8DJgzm3fKfZTxgCnNhesfh }
  - { name: containers, id: PL2yQDdvlhXf8pA545zLt-nvRSz7KK6_Cx }
  - { name: databases, id: PL2yQDdvlhXf8j0dn2Eji_gRtWnRB9rK-G }
  - { name: devops, id: PL2yQDdvlhXf-yQlZNNOU_euffLvcOLH6C }
  - { name: end-user, id: PL2yQDdvlhXf_pT-dKkjVFKhOnAid72YID }
  - { name: enterprise, id: PL2yQDdvlhXf9RsGOjFWnau4dEhBBFRj-n }
  - { name: financial, id: PL2yQDdvlhXf8xs-cUwFBXKlfn3ATJLdaW }
  - { name: iot, id: PL2yQDdvlhXf85CDFKMRyrj3ltMAOJENWF }
  - { name: life-sciences, id: PL2yQDdvlhXf-n2Anxw_pxT4hT3lDL61gr }
  - { name: mgmt-tools, id: PL2yQDdvlhXf8ea2DTRJKese1aZv0Anr9Y }
  - { name: manufacturing, id: PL2yQDdvlhXf_m9yePiD4PXLOtI1WcVnN1 }
  - { name: marketplace, id: PL2yQDdvlhXf_owJJpafvc9cAQLU4McA3t }
  - { name: mobile, id: PL2yQDdvlhXf-GZxV0-jOn1jUcNdJN33K_ }
  - { name: netflix, id: PL2yQDdvlhXf_D8cOeCOc6lqJL5Ob5BZtF }
  - { name: networking, id: PL2yQDdvlhXf9q98eYr9HkJkf2vJA0S3Ht }
  - { name: open-source, id: PL2yQDdvlhXf910nPsiMgYZLPWX9qqX_m6 }
  - { name: public-sector, id: PL2yQDdvlhXf8n0UHFhtEll7ASeHUicRiS }
  - { name: robotics, id: PL2yQDdvlhXf88hx5_nMcrGYnGvqldP5ME }
  - { name: security, id: PL2yQDdvlhXf9Ub-ekxAq0wMJpslV562SP }
  - { name: startup, id: PL2yQDdvlhXf8OibHl1RoJYpO7jpxduHF4 }
  - { name: storage, id: PL2yQDdvlhXf86aDDsZqqpYkQi6rrahR_2 }
  - { name: windows, id: PL2yQDdvlhXf-lgTJbecT5VNCGa1aejdU9 }
---

AWS does a great job sharing content from their yearly [re:Invent conference](https://reinvent.awsevents.com).  However, it's difficult to find this content in one (easily searchable) place.  This page is built with the help of the [gatsby-transformer-playlists](https://github.com/pofallon/gatsby-transformer-playlists) plugin.  Enjoy!

<div>
  { Object.values(props.playlists).map(p =>
    <ReinventProcessor playlist={p}>
      <Playlist />
    </ReinventProcessor>
  ) }
</div>