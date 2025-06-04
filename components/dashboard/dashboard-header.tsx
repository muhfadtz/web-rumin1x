"use client"

import { MobileNav } from "./mobile-nav" // Pastikan path ini benar
// Jika Anda memiliki ikon SVG atau komponen ikon untuk brand Anda, bisa diimpor di sini
// import { YourBrandIcon } from "@/components/icons/your-brand-icon";

export function DashboardHeader() {
  return (
    <header className="border-b border-gray-200/75 bg-white/85 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      {/*
        Penyesuaian:
        - border-gray-200/75: Warna border sedikit lebih transparan/lembut.
        - bg-white/85: Background sedikit lebih transparan.
        - backdrop-blur-lg: Efek blur lebih kuat.
        - shadow-sm: Menambahkan bayangan tipis di bawah header.
      */}
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Padding standar container untuk responsivitas */}

        {/* Grup Kiri: Navigasi Mobile dan Judul Dashboard */}
        <div className="flex items-center gap-3 md:gap-4"> {/* Jarak antara MobileNav dan blok judul */}
          <MobileNav /> {/* Komponen navigasi mobile Anda */}

          {/* Judul Dashboard untuk tampilan desktop */}
          <div className="hidden md:flex flex-col justify-center">
            {/*
              Anda bisa menambahkan logo/ikon di sini jika MobileNav tidak menampilkannya di desktop.
              Contoh:
              <Link href="/dashboard" className="flex items-center gap-2">
                <YourBrandIcon className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold tracking-tighter text-gray-800">Ruminix</h1>
              </Link>
            */}
            <h1 className="text-lg font-semibold tracking-tight text-gray-800 hover:text-gray-900 transition-colors duration-150">
              Ruminix
            </h1>
            <p className="text-xs text-gray-500 -mt-0.5"> {/* Sedikit margin atas negatif untuk merapatkan ke judul */}
              Real-time IoT monitoring
            </p>
          </div>
        </div>

        {/* Spacer: Akan mendorong elemen berikutnya ke kanan */}
        <div className="flex-grow"></div>

        {/* Grup Kanan: Bisa diisi dengan UserMenu, Avatar, dll. nanti */}
        {/* <div className="flex items-center gap-x-2">
          <p className="text-sm text-gray-700">User Name</p>
          // Avatar atau tombol User Menu
        </div>
        */}
      </div>
    </header>
  )
}