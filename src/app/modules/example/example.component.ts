import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DynamicStepperService } from 'src/app/commons/dynamic-stepper/services/dynamic-stepper.service';
import { DemoProduct, getIntiOil, valueSelectbox ,ExampleDataSource } from 'src/app/shared-model/demoModel';
import swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { PostDayService } from 'src/app/service/postday-service/postday-service';
import { AddStockMonthlyParam, AddStockParam } from 'src/app/model/sale/postday.interface';
import { DefaultService } from 'src/app/service/default.service';
import { async } from '@angular/core/testing';
import Swal from 'sweetalert2';
import { LangService, LangType } from 'src/app/service/Lang.service';

export interface formEntity {
  checkbox?: boolean;
  dropdown?: string;
  textbox?: string;
}

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
  LangSelect : string = "Thai";
  public OnLangChange(lang : LangType){
    this._svLang.SetLang(lang);
  }


  myFormGroup: FormGroup;
  HiddenFormGroup: FormGroup;
  SelectFormGroup: FormGroup;
  firstFormGroup: FormGroup; // form group in step1
  secondFormGroup: FormGroup; // form group in step2
  oilEntity : DemoProduct[]=[];
  TotalRow : number=0;
  countRow : number=0; // variable for run create rows in table
  TableForms : formEntity[]=[];
  dataSource :ExampleDataSource;
  language="";// variable for display value btn dropdown
  date_format="";
  cardOrder=0; // variable for run create cards
  numberShow=9999999; // variable for show in Table (Text Show)
  dateShow=new Date(); // variable for show in Table (Text Show)
  TextShow="สร้างสมดุลระหว่างการพัฒนาและการเติบโตของบริษัท การกำกับดูแลกิจการที่ดี การบริหารความเสี่ยง \
  การเพิ่มประสิทธิภาพการดำเนินงาน และการสร้างคุณค่าให้กับชุมชนและสังคม"; // variable for show in Table (Text Show)

  TabEntity = [
    {
      tab_no: 1,
      tab_name: "Tab1",
    },
  ]; // for control Tab dynamic

  dataType_PS: valueSelectbox[]=[
    {KEY:"ใบกำกับภาษีเต็มรูป",VALUE:"ใบกำกับภาษีเต็มรูป"},
    {KEY:"ใบกำกับภาษีอย่างย่อ",VALUE:"ใบกำกับภาษีอย่างย่อ"},
    {KEY:"ใบกำกับภาษีส่งของ",VALUE:"ใบกำกับภาษีส่งของ"},
  ]; // init dropdown unit
  data: valueSelectbox[];

  displayedColumnsAll: string[] = ['no', 'name', 'meter', 'station', 'old_price' ,'new_price'];

  //### Ex for date range
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  //### Ex for date range
  time = {hour: 13, minute: 30};
  time1 = {hour: 13, minute: 30};
  meridian = true;

  pageSizeEntity:DemoProduct[]=[];
  pageSize =6;
  TotalRowPageSize : number=0;

  //function for infinit scroll
  @HostListener('scroll', ['$event'])
    onScroll(event: any) {
        // visible height + pixel scrolled >= total height
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
          console.log("End Table call function getDataPageSize()");
          this.pageSize += 6;
          this.getDataPageSize();
        }
    }

  constructor(
    private _formBuilder: FormBuilder ,
    private stepperService: DynamicStepperService,
    private datePipe: DatePipe ,
    private calendar: NgbCalendar, //### Ex for date range
    public formatter: NgbDateParserFormatter, //### Ex for date range
    private _svPostDay : PostDayService,
    private _svDefault : DefaultService ,
    private _svLang : LangService
  )
  {
    this.data=[];
    for (let i = 1; i <= 100; i++)
    {
      this.data.push({
        KEY: "Data "+ i ,
        VALUE: i.toString(),
        GROUP: (i<=30 ? "ลำดับที่ 1-30" : (i<=60) ? "ลำดับที่ 31-60" : "ลำดับที่ 61-100")
      });
    }
    this.fromDate = calendar.getToday();//### Ex for date range
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);//### Ex for date range

  }

  ngOnInit() {

    this.myFormGroup = this._formBuilder.group({
      table_forms:this._formBuilder.array([]),
    });

    //form group for hidden table
    this.HiddenFormGroup = this._formBuilder.group({
      no:[true],
      name:[true],
      meter:[true],
      station:[true],
      old_price:[true],
      new_price:[true]
    });

    //form group for Selete card
    this.SelectFormGroup = this._formBuilder.group({
      nomal:[null],
      search:[null],
      multi:[null],
      group:[null],
    });

    //form group in stepper
    this.firstFormGroup = this._formBuilder.group({

    });
    this.secondFormGroup = this._formBuilder.group({

    });
    //form group in stepper

    this.language="TH"
    this.date_format=""
    this.stepperService.DATA_STEP=[]; //reset content stepper ทุกครั้ง ที่เข้ามายัง page นี้
    this.stepperService.setValidation(false); //set ให้ stepper กด next ได้
    this.oilEntity = getIntiOil();
    this.TotalRow = this.oilEntity.length;

    this.getDataPageSize();
  }

  public async SendBlobLog(){
    Swal.fire("ทดสอบ" , "", "info");
  }

public async TestSelectDateClick(){
  await this._svDefault.DoActionAsync(async()=> {
    let strSelectDate = await (await this._svPostDay.TestSelectDate()).toString();
    Swal.fire(strSelectDate , "", "info");
  },true);  
}
public async TestSelectDate2Click(){
  await this._svDefault.DoActionAsync(async()=> {
    let strSelectDate = await (await this._svPostDay.TestSelectDate2()).toString();
    Swal.fire(strSelectDate , "", "info");
  },true);  
}

public AddStockParam = new AddStockParam();
public async AddStockParamClick(){
  await this._svDefault.DoActionAsync(async()=>{
    let numEffect = await this._svPostDay.AddStock(this.AddStockParam);
    Swal.fire(`AddStock Complete With ${numEffect} Row`,"","info");
  },true);
}
public AddStockMonthlyParam = new AddStockMonthlyParam();
public async AddStockMonthlyClick(){
  await this._svDefault.DoActionAsync(async()=>{
    let numEffect = await this._svPostDay.AddStockMonthly(this.AddStockMonthlyParam);
    Swal.fire(`AddStockMonthly Complete With ${numEffect} Row`,"","info");
  },true);
}


  getDataPageSize()
  {
    let i = 0;
    this.pageSizeEntity =[];
    while (i < this.pageSize && i < this.oilEntity.length)
    {
      this.pageSizeEntity.push(this.oilEntity[i]);
      i++;
    }
    this.TotalRowPageSize = this.pageSizeEntity.length;
  }

  addTab()
  {
    let tab = {
      tab_no: Number(this.TabEntity.length+1) ,
      tab_name: "Tab" + Number(this.TabEntity.length+1) ,
    };
    this.TabEntity.push(tab);
  };
  delTab(key)
  {
    this.TabEntity.splice(this.TabEntity.findIndex(c=>c.tab_no == key),1);
  }

  addRow()
  {
    this.countRow +=1;
    this.addEntityForms()
  }
  delRow()
  {
    this.countRow -=1;
  }

  addEntityForms(){
    let i =0;
    this.TableForms.push({checkbox:false , dropdown :null, textbox:""});
    this.TableForms.forEach(element => {
      this.entityForms.push(this.EntityForm({checkbox:false , dropdown :null, textbox:""}));
      this.entityForms.controls[i].patchValue({checkbox:false , dropdown :null, textbox:""});
    });
  }
  get entityForms(): FormArray {
    return this.myFormGroup.get('table_forms') as FormArray;
  };
  EntityForm(data: formEntity, disabled: boolean = false) {
    return this._formBuilder.group({
      checkbox: data.checkbox,
      dropdown: data.dropdown,
      textbox: data.textbox,
    });
  }
  checkAll()
  {
    let i=0;
    this.entityForms.controls.forEach(element => {
      this.entityForms.push(this.EntityForm({checkbox:true}));
      this.entityForms.controls[i++].patchValue({checkbox:true});
    });
  }


  changeLanguage(value:string){
    this.language = value;
  }
  ClearSelect()
  {
    this.SelectFormGroup = this._formBuilder.group({
      nomal:[""],
      search:[null],
      multi:[null],
      group:[null],
    });

  }

  changeFormatDate()
  {
    this.date_format = this.datePipe.transform(new Date(), 'dd/MM/yyyy')
  }
  addCard()
  {
    this.cardOrder+=1;
  }
  delCard()
  {
    this.cardOrder-=1;
  }

  //#### after submit goto next step
  alertWithSuccess_Stepper = (step_id:string = ""):void => {





    alert("sadsad");
    swal.fire('บันทึกข้อมูลสำเร็จ', 'You submitted succesfully!', 'success')
    .then(()=>{
      this.stepperService.setValidation(false);
      this.stepperService.gotoStep(2,step_id);

    });
  }

  alertWithSuccess(){
    swal.fire('บันทึกข้อมูลสำเร็จ', 'You submitted succesfully!', 'success');
  }

  alertWithError(){
    swal.fire('มีข้อผิดพลาด', 'Error', 'error');
  }

  alertWithConfirm()
  {

    swal.fire({
      title: 'ยืนยันการลบข้อมูลหรือไม่',
      text: 'หากลบข้อมูลแล้วไม่สามารถนำกลับมาได้อีก',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'ยืนยัน',
      denyButtonText: 'ไม่ยืนยัน'
    }).then((result) => {
      if (result.value) {
        swal.fire(
          'ลบข้อมูลสำเร็จ',
          '',
          'success'
        )
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire(
          'ยกเลิกการลบข้อมูล',
          '',
          'error'
        )
      }
    });
  }

  alertWithMagess(msg,icon)
  {
    swal.fire({
      icon: icon,
      title: msg,
      showConfirmButton: false,
      timer: 1500
    })
  }

  alertLoaddingSpinner()
  {
    swal.fire({
      title: "<div class='spinner-border text-info' style='width: 5rem; height: 5rem;' role='status'> \
              <span class='sr-only'>Loading...</span></div>",
      text:"Loadding...",
      showConfirmButton: false,
      timer: 1500
    })
  }

  alertLoaddingBar1()
  {
    swal.fire({
      title:"<div class='bars1'> \
          <span></span> \
          <span></span> \
          <span></span> \
          <span></span> \
      </div> ",
      text:"Loadding...",
      showConfirmButton: false,
      timer: 1500
    })
  }

  alertLoaddingBar2()
  {
    swal.fire({
      title:"<div class='bars2'> \
                <span></span> \
                <span></span> \
                <span></span> \
                <span></span> \
            </div> ",
      text:"Loadding...",
      showConfirmButton: false,
      timer: 1500
    })
  }


  counter(i: number) {
    return new Array(i);
  }


  //### Ex for date range
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  //### End Ex for date range
  toggleMeridian() {
    this.meridian = !this.meridian;
  }


  //###### mockup data for Table custom
  dataTable: any[] = [
    {
      id: 1,
      first_name: "Osbourne",
      last_name: "Godthaab",
      email: "ogodthaab0@chron.com",
      gender: "Male",
      ip_address: "183.146.28.176",
    },
    {
      id: 2,
      first_name: "Karol",
      last_name: "Aloshkin",
      email: "kaloshkin1@dion.ne.jp",
      gender: "Female",
      ip_address: "33.89.4.64",
    },
    {
      id: 3,
      first_name: "Morrie",
      last_name: "Sawood",
      email: "msawood2@cloudflare.com",
      gender: "Male",
      ip_address: "52.102.59.137",
    }
  ];

  config = {
    tableTitle: "Detail Data",
    buttonForm: true,
    buttonFormClass: "btn btn-primary waves-effect ",
    buttonFormText: "Add Detail",
    buttonFilter: false,
    buttonFilterText: "Filter",
    buttonFilterClass: "btn btn-secondary waves-effect ",
  };

  columns: any[] = [
    {
      headerText: "ID",
      headerTextAlign: "center",
      fieldName: "id",
      fieldType: "text",
      fieldPlaceholder: "Enter your id.",
      isShow: true,
    },
    {
      headerText: "First Name",
      headerTextAlign: "center",
      fieldName: "first_name",
      fieldType: "text",
      fieldPlaceholder: "Enter your first Name.",
      textAlign: "left",

      isShow: true,
    },
    {
      headerText: "Last Name",
      headerTextAlign: "center",
      fieldName: "last_name",
      fieldType: "text",
      fieldPlaceholder: "Enter your last Name.",
      textAlign: "left",

      isShow: true,
    },
    {
      headerText: "Email Address",
      fieldName: "email",
      fieldType: "email",
      fieldPlaceholder: "Enter your email.",
      textAlign: "left",

      isShow: true,
    },
    {
      headerText: "Gender",
      fieldName: "gender",
      fieldType: "text",
      fieldPlaceholder: "Enter your gender.",
      textAlign: "center",

      isShow: true,
    },
    {
      headerText: "IP Address",
      fieldName: "ip_address",
      fieldType: "text",
      fieldPlaceholder: "Enter your ip address.",
      textAlign: "left",

      isShow: true,
    },
    {
      headerText: "Action",
      isShow: true,
      isButton: true,
      customButton: [
        {
          actionCustomForm: "custom-content-1",
          buttonText: '<i class="fas fa-pencil-alt"></i>',
          actionMethod: "update",
        },
        {
          actionCustomForm: "custom-content-2",
          buttonText: '<i class="fas fa-cog"></i>',
        },
        {
          buttonText: '<i class="far fa-trash-alt"></i>',
          actionMethod: "delete",
        },
      ],
    },
  ];
  //#####

}//##
