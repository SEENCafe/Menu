// Fallback menu data, shown only if Firestore can't be reached (e.g. a
// customer with no connectivity who has never loaded the site before).
//
// `defaultMenu` below is regenerated automatically every few minutes by
// .github/workflows/sync-menu.yml (via scripts/sync-menu.mjs) from the live
// Firestore data, so manual edits to it will be overwritten — update prices
// through admin.html instead. `cafeInfo` is not stored in Firestore and can
// still be edited here by hand.

export const cafeInfo = {
  name: 'کافه سین',
  address: 'آباده، بلوار بوعلی، بریدگی آخر',
  phones: ['07144368774', '09178530185'],
  instagram: 'https://instagram.com/seen_cafe__',
};

export const defaultMenu = [
  {
    "id": "hot-bars",
    "icon": "☕",
    "name": "بار گرم",
    "items": [
      {
        "id": "i1",
        "name": "اسپرسو ۶۰ ربوستا",
        "price": "۸۰-۱۰۰"
      },
      {
        "id": "i2",
        "name": "اسپرسو 90 روبوستا",
        "price": "۸۰-۱۰۰"
      },
      {
        "id": "i3",
        "name": "اسپرسو 100 عربیکا",
        "price": "۸۰-۱۳۰"
      },
      {
        "id": "i4",
        "name": "آمریکانو",
        "price": "۹۰"
      },
      {
        "id": "i5",
        "name": "امریکنو عربیکا",
        "price": "۱۰۰-۱۴۰"
      },
      {
        "id": "i6",
        "name": "عصاره زنجبیل",
        "price": "۱۰۰"
      },
      {
        "id": "i7",
        "name": "قهوه ترک",
        "price": "۱۵۰"
      },
      {
        "id": "i9",
        "name": "کاپوچینو",
        "price": "۱۵۰"
      },
      {
        "id": "i10",
        "name": "نسکافه",
        "price": "۱۵۰"
      },
      {
        "id": "i11",
        "name": "هات چاکلت",
        "price": "۱۸۰"
      },
      {
        "id": "i12",
        "name": "ماسالا",
        "price": "۱۵۰"
      },
      {
        "id": "i13",
        "name": "وایت چاکلت",
        "price": "۱۵۰"
      },
      {
        "id": "i14",
        "name": "پینک چاکلت",
        "price": "۱۵۰"
      },
      {
        "id": "i15",
        "name": "کرک",
        "price": "۱۸۰"
      },
      {
        "id": "i16",
        "name": "لته",
        "price": "۱۸۰"
      },
      {
        "id": "i17",
        "name": "موکا",
        "price": "۲۰۰"
      },
      {
        "id": "i18",
        "name": "کارامل ماکیاتو",
        "price": "۲۰۰"
      }
    ]
  },
  {
    "id": "cold-bars",
    "icon": "🧊",
    "name": "بار سرد",
    "items": [
      {
        "id": "i21",
        "name": "آفوگاتو",
        "price": "۱۶۰"
      },
      {
        "id": "i22",
        "name": "لیموناد",
        "price": "۱۸۰"
      },
      {
        "id": "i23",
        "name": "موهیتو",
        "price": "۱۸۰"
      },
      {
        "id": "i24",
        "name": "آیس لته",
        "price": "۱۸۰"
      },
      {
        "id": "i25",
        "name": "آیس کارامل ماکیاتو",
        "price": "۲۰۰"
      },
      {
        "id": "i26",
        "name": "آیس موکا",
        "price": "۲۰۰"
      },
      {
        "id": "i27",
        "name": "سیروپ",
        "price": "۵۰"
      }
    ]
  },
  {
    "id": "shakes",
    "icon": "🥤",
    "name": "شیک",
    "items": [
      {
        "id": "i28",
        "name": "شیک وانیل",
        "price": "۲۰۰"
      },
      {
        "id": "i29",
        "name": "شیک توت‌فرنگی",
        "price": "۲۰۰"
      },
      {
        "id": "i30",
        "name": "شیک شکلات",
        "price": "۲۰۰"
      },
      {
        "id": "i31",
        "name": "شیک نسکافه",
        "price": "۲۸۰"
      },
      {
        "id": "i32",
        "name": "شیک اسپرسو",
        "price": "۲۸۰"
      },
      {
        "id": "i33",
        "name": "شیک موز",
        "price": "۲۸۰"
      },
      {
        "id": "i34",
        "name": "شیک موز شکلات",
        "price": "۲۸۰"
      },
      {
        "id": "i35",
        "name": "شیک موز اسپرسو",
        "price": "۳۰۰"
      },
      {
        "id": "i36",
        "name": "شیک موز نسکافه",
        "price": "۳۰۰"
      },
      {
        "id": "i37",
        "name": "شیک موز نوتلا",
        "price": "۳۰۰"
      },
      {
        "id": "i38",
        "name": "شیک نوتلا",
        "price": "۲۸۰"
      },
      {
        "id": "i39",
        "name": "شیک بادام زمینی",
        "price": "۲۸۰"
      },
      {
        "id": "i40",
        "name": "شیک کیت کت",
        "price": "۲۸۰"
      },
      {
        "id": "i41",
        "name": "شیک اورئو",
        "price": "۲۸۰"
      },
      {
        "id": "i42",
        "name": "شیک لوتوس",
        "price": "۲۸۰"
      }
    ]
  },
  {
    "id": "cakes",
    "icon": "🎂",
    "name": "کیک",
    "items": [
      {
        "id": "i43",
        "name": "کیک هویج گردو",
        "price": "۱۲۰"
      },
      {
        "id": "item_1eaa44c6",
        "name": "کیک شکلاتی",
        "price": "۱۸۰"
      },
      {
        "id": "item_5407c6b2",
        "name": "تیرامیسو",
        "price": "۲۲۰"
      },
      {
        "id": "item_5784a58a",
        "name": "چیزکیک",
        "price": "۲۲۰"
      },
      {
        "id": "item_05379e8b",
        "name": "معجون پسته‌ای",
        "price": "۱۷۰"
      },
      {
        "id": "item_91fa59cd",
        "name": "باقلوا",
        "price": "۵۰"
      }
    ]
  },
  {
    "id": "foreign-dishes",
    "icon": "🍝",
    "name": "غذای فرنگی",
    "items": [
      {
        "id": "i46",
        "name": "پاستا آلفردو چیکن",
        "price": "۵۸۵"
      },
      {
        "id": "i47",
        "name": "چیکن استراگانوف",
        "price": "۵۹۰"
      },
      {
        "id": "i48",
        "name": "پاستا آلفردو بیف",
        "price": "۹۲۰"
      },
      {
        "id": "i49",
        "name": "بیف استراگانوف",
        "price": "۹۲۰"
      },
      {
        "id": "i50",
        "name": "سالاد سزار",
        "price": "۵۶۰"
      }
    ]
  },
  {
    "id": "fast-food",
    "icon": "🍕",
    "name": "فست فود",
    "items": [
      {
        "id": "i51",
        "name": "سیب‌زمینی",
        "price": "۲۰۰"
      },
      {
        "id": "i52",
        "name": "نان سیر",
        "price": "۴۱۰-۵۷۰"
      },
      {
        "id": "i53",
        "name": "پیتزا مخصوص",
        "price": "۵۱۰-۷۶۰"
      },
      {
        "id": "i54",
        "name": "پیتزا پپرونی",
        "price": "۵۱۰-۷۶۰"
      },
      {
        "id": "i55",
        "name": "پیتزا گوشت و قارچ",
        "price": "۶۹۰-۹۹۰"
      },
      {
        "id": "i56",
        "name": "پیتزا چیکن",
        "price": "۷۴۰-۱۱۰۰"
      },
      {
        "id": "i57",
        "name": "پیتزا رست بیف",
        "price": "۷۴۰-۱۱۰۰"
      },
      {
        "id": "i58",
        "name": "پیتزا سیر و استیک",
        "price": "۹۹۰-۱۵۰۰"
      }
    ]
  },
  {
    "id": "steaks",
    "icon": "🥩",
    "name": "استیک",
    "items": [
      {
        "id": "i59",
        "name": "استیک مرغ",
        "price": "۷۵۰"
      },
      {
        "id": "i60",
        "name": "استیک فیله گوساله",
        "price": "۱۱۵۰"
      }
    ]
  }
];
