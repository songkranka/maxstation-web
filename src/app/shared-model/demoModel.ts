import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';

export interface DemoProduct {
    name: string;
    position: string;
    meter: number;
    station: string;
    old_price: number;
    new_price: number;
    path:string;
    hide:boolean;
    type?:string;
}
const demoData: DemoProduct[] = [
    {position: "00A", name: 'ดีเซล', meter: 24345.12, station: 'A' , old_price:21.00 , new_price:23.00 , path:"../../assets/images/oil-price/t-diesel.png",hide:true , type:"D"},
    {position: "00B", name: 'ดีเซล B7', meter: 10022.34, station: 'B' , old_price:23.00 , new_price:23.00 , path:"../../assets/images/oil-price/t-b-7.png",hide:true , type:"D"},
    {position: "00C", name: 'ดีเซล B20', meter: 6721.00, station: 'C' , old_price:21.40 , new_price:23.50 , path:"../../assets/images/oil-price/t-b-20.png",hide:true , type:"D"},
    {position: "00D", name: 'แก๊สโซฮอล์ 91', meter: 19022.49, station: 'D', old_price:29.00 , new_price:29.50 , path:'../../assets/images/oil-price/t-n-91.png',hide:true , type:"B"},
    {position: "00E", name: 'แก๊สโซฮอล์ 95', meter: 12345.00, station: 'E', old_price:27.30 , new_price:27.90 , path:'../../assets/images/oil-price/t-n-95.png',hide:true , type:"B"},
    {position: "00F", name: 'เบนซิน', meter:992.01, station: 'F', old_price:29.82 , new_price:28.00 , path:'../../assets/images/oil-price/t-bensin.png',hide:true , type:"B"},
    {position: "00G", name: 'แก๊สโซฮอล์ E20', meter:98272.90 , station: 'G', old_price:22.30 , new_price:19.90 , path:'../../assets/images/oil-price/t-e-20.png',hide:true , type:"B"},
    {position: "00H", name: 'แก๊ส LPG', meter:300.90 , station: 'H', old_price:16.00 , new_price:17.00 , path:'../../assets/images/oil-price/lpg.png',hide:true , type:"L"}
];

export class ExampleDataSource extends DataSource<DemoProduct> {
    /** Stream of data that is provided to the table. */
    data = new BehaviorSubject<DemoProduct[]>(demoData);
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<DemoProduct[]> {
      return this.data;
    }
    disconnect() {}
}

//for dropdown
export interface valueSelectbox {
  KEY: string;
  VALUE?: string;
  IS_CHECKED?: boolean;
  QTY?: number;
  GROUP?:string;
}

//######## function for get init Data
export function getIntiOil():DemoProduct[]
{
  return demoData;
}



//### mockup data menu
export interface MenuModel {
  group: string;
  group_order: number;
  level:number;
  menu_id: string;
  menu_name: string;
  menu_order: number;
  menu_icon: string;
  route: string;
}

export const menuEntity: MenuModel[] = [

    {group:"A", group_order: 6 , level :0 ,menu_id:"0100", menu_name : "งานประจำวัน" , menu_order : 0 , menu_icon:"fas fa-file" , route:"" },
    {group:"A", group_order: 6 , level :1 ,menu_id:"0101", menu_name : "POS" , menu_order : 1 , menu_icon:"fas fa-folder-minus" , route:"/PosList/" },
    
    {group:"B", group_order: 4 , level :0 ,menu_id:"0200", menu_name : "การขาย" , menu_order : 0 , menu_icon:"fas fa-file" , route:"" },    
    {group:"B", group_order: 4 , level :1 ,menu_id:"0201", menu_name : "ใบเสนอราคา" , menu_order : 1 , menu_icon:"fas fa-folder-minus" , route:"/QuotationList/" },
    {group:"B", group_order: 4 , level :1 ,menu_id:"0202", menu_name : "ขายสด" , menu_order : 2 , menu_icon:"fas fa-folder-minus" , route:"/CashsaleList/" },
    {group:"B", group_order: 4 , level :1 ,menu_id:"0203", menu_name : "ขายเชื่อ" , menu_order : 3 , menu_icon:"fas fa-folder-minus" , route:"/CreditSaleList/" },
    {group:"B", group_order: 4 , level :1 ,menu_id:"0204", menu_name : "ใบแจ้งหนี้" , menu_order : 4 , menu_icon:"fas fa-folder-minus" , route:"/InvoiceList/" },
    {group:"B", group_order: 4 , level :1 ,menu_id:"0205", menu_name : "ใบกำกับภาษีเต็มรูป" , menu_order : 5 , menu_icon:"fas fa-folder-minus" , route:"/CashtaxList/" },
    {group:"B", group_order: 4 , level :1 ,menu_id:"0206", menu_name : "ใบวางบิล" , menu_order : 6 , menu_icon:"fas fa-folder-minus" , route:"/BillingList" },
    {group:"B", group_order: 4 , level :1 ,menu_id:"0207", menu_name : "เพิ่ม/ลดหนี้" , menu_order : 7 , menu_icon:"fas fa-folder-minus" , route:"/CreditNoteList" },
    
  
    {group:"C", group_order: 5 , level :0 ,menu_id:"0300", menu_name : "การเงิน" , menu_order : 0 , menu_icon:"fas fa-file" , route:"" },
    {group:"C", group_order: 5 , level :1 ,menu_id:"0301", menu_name : "รับชำระเงิน" , menu_order : 1 , menu_icon:"fas fa-folder-minus" , route:"/ReceiveList" }, 
  
  
    {group:"D", group_order: 3 , level :0 ,menu_id:"0400", menu_name : "สินค้าคงคลัง" , menu_order : 0 , menu_icon:"fas fa-file" , route:"" },
    {group:"D", group_order: 3 , level :1 ,menu_id:"0401", menu_name : "รับน้ำมันใส/สินค้าอื่น" , menu_order : 1 , menu_icon:"fas fa-folder-minus" , route:"/ReceiveOilList/" },
    {group:"D", group_order: 3 , level :1 ,menu_id:"0402", menu_name : "รับแก๊ส" , menu_order : 2 , menu_icon:"fas fa-folder-minus" , route:"/ReceiveGasList/" },
    {group:"D", group_order: 3 , level :1 ,menu_id:"0403", menu_name : "ร้องขอสินค้า" , menu_order : 3 , menu_icon:"fas fa-folder-minus" , route:"/RequestList/" },
    {group:"D", group_order: 3 , level :1 ,menu_id:"0404", menu_name : "โอนจ่ายสินค้า" , menu_order : 4 , menu_icon:"fas fa-folder-minus" , route:"/TransferOutList/" },
    {group:"D", group_order: 3 , level :1 ,menu_id:"0405", menu_name : "รับโอนสินค้า" , menu_order : 5 , menu_icon:"fas fa-folder-minus" , route:"/TransferInList/" },
    {group:"D", group_order: 3 , level :1 ,menu_id:"0406", menu_name : "เบิกใช้ในกิจการ" , menu_order : 6 , menu_icon:"fas fa-folder-minus" , route:"/WithdrawList/" },
  
];