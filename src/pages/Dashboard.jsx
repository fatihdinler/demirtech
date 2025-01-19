import React from "react";
import Card from "../components/UI/Card";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiDevices } from "react-icons/bi";

function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Küçük kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Toplam Satış"
          value="$21,456"
          icon={<AiOutlineShoppingCart size={30} className="text-primary" />}
        />
        <Card
          title="Toplam Device"
          value="45"
          icon={<BiDevices size={30} className="text-primary" />}
        />
        <Card
          title="Aktif Kullanıcı"
          value="1200"
        />
        <Card
          title="Arıza Oranı"
          value="3.2%"
        />
      </div>

      {/* Altta daha büyük bir kart örneği */}
      <Card title="Genel Bakış">
        <p className="text-gray-600 text-sm">
          Bu ekranda cihazlara dair genel özetleri görebilirsiniz. Grafikler, tablolar vb. eklenecektir.
        </p>
      </Card>
    </div>
  );
}

export default Dashboard;
