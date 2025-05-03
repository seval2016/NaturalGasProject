export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Doğalgaz Hizmetleri</h1>
      <p className="text-lg mb-4">Profesyonel doğalgaz çözümleri sunuyoruz.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Tesisat Hizmetleri</h2>
          <p>Profesyonel doğalgaz tesisatı kurulum ve bakım hizmetleri.</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Bakım ve Onarım</h2>
          <p>Düzenli bakım ve acil onarım hizmetleri.</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Danışmanlık</h2>
          <p>Doğalgaz sistemleri konusunda uzman danışmanlık hizmetleri.</p>
        </div>
      </div>
    </div>
  );
}
