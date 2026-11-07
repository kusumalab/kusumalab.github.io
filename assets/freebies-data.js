/* Data freebies Kusuma Lab. Satu-satunya tempat menambah atau mengubah freebie.
   Cara menambah freebie baru: salin satu blok di "freebies", ganti isinya, taruh paling atas.
   core:true hanya untuk 4 freebie fondasi yang tampil di halaman utama. Freebie dari konten selalu core:false.
   Di prompt, {id} diganti isi kolom dengan id yang sama. */
window.KL_DATA = {
  site: 'https://kusumalab.com',
  categories: {
    kantor: {
      label: 'Kerjaan Kantor',
      desc: 'Temukan kerjaan berulang, lalu delegasikan ke AI',
      note: 'Jangan upload data rahasia kantor ke AI manapun. Samarkan dulu nama orang, angka, dan dokumen sensitifnya.'
    },
    creator: {
      label: 'Solo Creator',
      desc: 'Petain posisimu, lalu temukan arah kontenmu',
      note: 'Hasil dari AI itu bahan refleksi, bukan vonis. Kamu yang paling kenal hidupmu, jadi ambil yang relevan aja, dan cek ulang sebelum dijalankan.'
    }
  },
  freebies: [
    {
      key: 'k1', slug: 'temukan-tugas', category: 'kantor', core: true, date: '2026-11-07', source: null,
      step: 'LANGKAH 1 · DISCOVER', chips: ['CLAUDE', 'CHATGPT', 'GEMINI'],
      title: 'Temukan kerjaan yang bisa kamu delegasikan ke AI',
      desc: 'Tiap kerjaan beda-beda. Petain dulu mana yang bisa dibantu AI sepenuhnya, mana yang sebagian, dan mana yang tetap harus kamu pegang.',
      fields: [
        { id: 'role', label: 'Kerjaanmu', type: 'text', value: 'staf administrasi di kantor', empty: '[kerjaanmu]' },
        { id: 'tools', label: 'Pengalaman pakai AI', type: 'select', options: [
          { label: 'Belum pernah', value: 'Aku belum pernah pakai tools AI untuk kerja.', selected: true },
          { label: 'ChatGPT', value: 'Tools AI yang pernah aku pakai sejauh ini ChatGPT.' },
          { label: 'Gemini', value: 'Tools AI yang pernah aku pakai sejauh ini Gemini.' },
          { label: 'Claude', value: 'Tools AI yang pernah aku pakai sejauh ini Claude.' },
          { label: 'Beberapa sekaligus', value: 'Tools AI yang pernah aku pakai sejauh ini beberapa tools sekaligus.' }
        ] }
      ],
      prompt: 'Aku kerja sebagai {role}. {tools}\nBantu aku menemukan kerjaan berulang yang bisa aku delegasikan ke AI.\n\nSebelum menjawab, tanyakan dulu 5 pertanyaan soal tugas harian, mingguan, dan bulananku. Tunggu sampai aku jawab.\n\nSetelah itu buat tabel berisi daftar tugas, seberapa sering muncul, tingkat bantuan AI (bisa penuh, sebagian, atau tidak bisa), tools AI yang cocok, dan contoh cara pakainya.\nTandai tugas yang melibatkan data sensitif, lalu sarankan cara menyamarkannya.\nTutup dengan 1 tugas yang paling layak aku delegasikan duluan, beserta alasannya.\nPakai bahasa santai dan gampang dipahami.',
      ais: ['claude', 'chatgpt', 'gemini']
    },
    {
      key: 'k2', slug: 'claude-project', category: 'kantor', core: true, date: '2026-11-07', source: null,
      step: 'LANGKAH 2 · BUILD', chips: ['CLAUDE ONLY', 'TUTORIAL'],
      title: 'Ubah satu kerjaan berulang jadi Claude Project',
      summary: 'Tutorial 5 langkah bikin Claude Project, plus prompt yang nulisin instructions-nya buat kamu.',
      edu: { title: 'Apa itu Claude Project?', text: 'Ruang kerja khusus buat satu jenis tugas. Instruksi dan contoh dokumennya cukup kamu set sekali. Setiap kali tugas yang sama datang, Claude udah paham konteksnya, jadi kamu nggak perlu jelasin dari awal lagi.' },
      how: [
        'Ambil satu tugas dari hasil langkah 1, isi kolom di bawah, lalu salin prompt-nya ke chat Claude. Claude akan nanya dulu, terus nulis <b>instructions</b> buat project-mu.',
        'Di Claude, buka menu <b>Projects</b>, lalu buat project baru. Kasih nama sesuai tugasnya.',
        'Tempel instructions tadi ke bagian <b>instructions</b> project.',
        'Upload template atau contoh dokumen yang sudah disamarkan ke bagian <b>context</b> project.',
        'Setiap tugas itu datang, kerjain dari chat di dalam project ini.'
      ],
      fields: [
        { id: 'task', label: 'Tugas berulangnya', type: 'text', value: 'bikin rekap laporan mingguan', empty: '[tugasmu]' },
        { id: 'freq', label: 'Seberapa sering', type: 'select', options: [
          { label: 'setiap hari' }, { label: 'setiap minggu', selected: true }, { label: 'setiap bulan' }
        ] }
      ],
      prompt: 'Aku mau bikin Claude Project khusus untuk satu tugas berulang, yaitu {task}. Tugas ini muncul {freq}.\n\nTulis instructions untuk project tersebut. Isinya peran Claude, langkah kerja yang harus diikuti, format hasil yang aku mau, hal yang tidak boleh dilakukan, dan cara menangani data sensitif.\nSebelum menulis, tanyakan dulu maksimal 5 hal yang kamu butuhkan dari aku.\n\nSetelah selesai, kasih juga daftar template atau contoh dokumen yang sebaiknya aku upload ke context project.',
      ais: ['claude'],
      fine: 'Fitur Projects bisa sedikit beda tergantung paket Claude yang kamu pakai.'
    },
    {
      key: 'c1', slug: 'cek-stage', category: 'creator', core: true, date: '2026-11-07', source: null,
      step: 'LANGKAH 1 · KENALI POSISIMU', chips: ['CLAUDE', 'CHATGPT', 'GEMINI'],
      title: 'Cek kamu ada di stage mana',
      desc: 'AI bakal nanya beberapa hal, terus bantu petain posisimu di roadmap 0 sampai 5, langkah konkret 30 hari ke depan, risikonya, dan apakah jalurmu lebih cocok di profesional atau bangun personal brand sendiri.',
      fields: [
        { id: 'age', label: 'Umur', type: 'select', options: [
          { label: 'di bawah 25 tahun' }, { label: '25 sampai 30 tahun', selected: true }, { label: 'di atas 30 tahun' }
        ] },
        { id: 'work', label: 'Kondisi kerja sekarang', type: 'select', options: [
          { label: 'karyawan kantoran', selected: true }, { label: 'freelancer' }, { label: 'punya usaha sendiri' }, { label: 'masih kuliah' }, { label: 'lagi cari kerja' }
        ] }
      ],
      prompt: 'Aku umur {age}, kondisi kerjaku sekarang {work}.\nBantu aku memetakan posisiku di roadmap 6 stage ini.\n\nStage 0 Wake Up, sadar dan mendefinisikan standar hidup sendiri.\nStage 1 Earn More, menaikkan earning power dan membangun sumber penghasilan tambahan.\nStage 2 Stay Safe, punya dana darurat dan proteksi dasar.\nStage 3 Manage Smart, punya sistem kelola uang.\nStage 4 Invest Right, mulai membuat uang ikut bekerja lewat investasi yang dipahami.\nStage 5 Freedom, bisa memilih kerja apa, di mana, dengan siapa, dan untuk apa.\n\nTanyakan 6 sampai 8 pertanyaan ke aku, satu per satu. Setelah semua terjawab, kasih tahu aku ada di stage mana (boleh lebih dari satu kalau memang berjalan barengan), 3 langkah konkret untuk 30 hari ke depan, risiko yang perlu aku waspadai, dan apakah jalurku lebih cocok fokus memakai AI untuk kerja profesional atau membangun personal brand sendiri sebagai solo creator.\n\nPakai bahasa santai dan jangan bikin aku overwhelmed. Ini bahan refleksi, bukan nasihat keuangan.',
      ais: ['claude', 'chatgpt', 'gemini']
    },
    {
      key: 'c2', slug: 'arah-konten', category: 'creator', core: true, date: '2026-11-07', source: null,
      step: 'LANGKAH 2 · TEMUKAN ARAHMU', chips: ['CLAUDE', 'CHATGPT', 'GEMINI'],
      title: 'Temukan arah kontenmu sebagai Solo Creator',
      desc: 'Mau ngonten apa, perjalanannya bakal kayak apa, cara monetisasinya, dan kenapa perhatian orang jadi mata uang paling berharga di era media sekarang.',
      fields: [
        { id: 'skill', label: 'Keahlian atau pengalamanmu', type: 'text', value: 'kerja administrasi dan suka ngulik AI', empty: '[keahlianmu]' },
        { id: 'time', label: 'Waktu ngonten per minggu', type: 'select', options: [
          { label: '3 sampai 5 jam' }, { label: '5 sampai 10 jam', selected: true }, { label: 'lebih dari 10 jam' }
        ] }
      ],
      prompt: 'Aku punya keahlian atau pengalaman di {skill}, dan bisa menyisihkan waktu {time} per minggu untuk bikin konten.\nBantu aku menemukan arah kontenku sebagai solo creator.\n\nTanyakan dulu 5 pertanyaan tentang minat, pengalaman, dan target audiensku.\n\nSetelah itu jelaskan 3 pilihan niche yang paling cocok beserta alasannya, gambaran perjalanan 12 bulan pertama yang realistis, pilihan monetisasi dari yang paling awal sampai yang butuh audiens besar, dan kenapa perhatian audiens adalah aset paling berharga di era media sekarang.\nSertakan juga risiko dan kesalahan yang paling sering dialami creator pemula.\nTutup dengan 3 langkah yang bisa langsung aku coba minggu ini. Pakai bahasa santai.',
      ais: ['claude', 'chatgpt', 'gemini']
    }
  ]
};
