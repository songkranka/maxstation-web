import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { log } from 'console';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelMasBranchCalibrate } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { ExcelReaderService } from '../ExcelReader.service';
@Component({
  selector: 'app-ExcelReader',
  templateUrl: './ExcelReader.component.html',
  styleUrls: ['./ExcelReader.component.scss']
})
export class ExcelReaderComponent implements OnInit {

  constructor(
    public SvDefault: DefaultService,
    private _svShared: SharedService,
    private _svExcel: ExcelReaderService,
    private authGuard: AuthGuard,
  ) { }
  @ViewChild('upload')
  upload: ElementRef<HTMLInputElement>;
  public ArrCalibrate: ModelMasBranchCalibrate[] = [];
  public CurrentIndex = 0;
  public TotalData = 0;
  public Percentage = 0;
  private authPositionRole: any;

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  ngOnInit() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
  }

  private async reader_Onload(e: ProgressEvent<FileReader>) {
    let data = e.target.result;
    let workbook = XLSX.read(data, {
      type: 'binary'
    });

    if (workbook == null || workbook.SheetNames.length === 0) {
      return;
    }
    let sheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[sheetName];
    if (sheet == null) {
      return;
    }
    let rang = XLSX.utils.decode_range(sheet['!ref']);
    let intRowCount = rang.e.r + 1;
    this.ArrCalibrate = [];
    let datTankStart = new Date(2022, 1, 1);
    let strCreateBy = this.SvDefault.GetString(this._svShared.user);
    let strErrorMessage = "";
    for (let j = 1; j <= intRowCount; j++) {
      let strCompCode = this.SvDefault.GetString(sheet["A" + j]?.v);
      if (strCompCode === "") {
        strErrorMessage = `A${j} : รหัสบริษัทห้ามมีค่าว่าง`;
        break;
      }
      if (strCompCode === "รหัสบริษัท" || strCompCode === "COMP_CODE") {
        continue;
      }
      let strBrnCode = this.SvDefault.GetString(sheet["B" + j]?.v);
      if (strBrnCode === "") {
        strErrorMessage = `B${j} : รหัสสาขาห้ามมีค่าว่าง`;
        break;
      }
      let strTankId = this.SvDefault.GetString(sheet["C" + j]?.v);
      if (strTankId === "") {
        strErrorMessage = `C${j} : รหัสถังห้ามมีค่าว่าง`;
        break;
      }
      let strProductLabel = this.SvDefault.GetString(sheet["D" + j]?.v);
      let arrProductLabel = strProductLabel.split(":");
      let strPdId = "";
      let strPdName = "";
      if (this.SvDefault.IsArray(arrProductLabel) && arrProductLabel.length >= 2) {
        strPdId = this.SvDefault.GetString(arrProductLabel[0]);
        strPdName = this.SvDefault.GetString(arrProductLabel[1]);
      }
      if (strPdId === "" || strPdName === "") {
        strErrorMessage = `D${j} : ชื่อหรือรหัสผลิตภัณผิดพลาด`;
        break;
      }
      if (!this.SvDefault.IsNumeric(sheet["E" + j]?.v)) {
        strErrorMessage = `E${j} : ระดับเกจวัดต้องเป็นตัวเลขเท่านั้น`;
        break;
      }
      let strLevel = this.SvDefault.GetString(sheet["E" + j]?.v);
      let numLevel = parseInt(strLevel);
      let strLevelUnit = this.SvDefault.GetString(sheet["F" + j]?.v);
      if (strLevelUnit === "") {
        strErrorMessage = `F${j} : หน่วยห้ามมีค่าว่าง`;
        break;
      }
      if (!this.SvDefault.IsNumeric(sheet["G" + j]?.v)) {
        strErrorMessage = `G${j} : ปริมาณแก๊สต้องเป็นตัวเลขเท่านั้น`;
        break;
      }
      let strQty = this.SvDefault.GetString(sheet["G" + j]?.v);
      let numQty = parseFloat(strQty);
      let clb = <ModelMasBranchCalibrate>{
        CompCode: strCompCode,
        BrnCode: strBrnCode,
        TankId: strTankId,
        PdId: strPdId,
        PdName: strPdName,
        LevelNo: numLevel,
        LevelUnit: strLevelUnit,
        TankQty: numQty,
        SeqNo: j,
        TankStart: datTankStart,
        CreatedBy: strCreateBy
      };
      this.ArrCalibrate.push(clb);
    }
    if (strErrorMessage !== "") {
      this.ArrCalibrate = [];
      Swal.fire(strErrorMessage, "", "error");
    } else {
      await this.uploadData(this.ArrCalibrate);
    }
    //console.log(this.ArrCalibrate);
    this.upload.nativeElement.value = "";
  }

  private parseExcel(file) {
    this.CurrentIndex = 0;
    this.TotalData = 0;
    var reader = new FileReader();

    reader.onload = async (e) => {
      await this.SvDefault.DoActionAsync(async () => await this.reader_Onload(e));
    }
    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  }

  private async uploadData(param: ModelMasBranchCalibrate[]) {
    if (!this.SvDefault.IsArray(param)) {
      return;
    }
    this.TotalData = param.length;
    for (let i = 0; i < param.length; i++) {
      let mbc = param[i];
      await this._svExcel.AddMasBranchCalibrate(mbc);
      this.CurrentIndex = i + 1;
      this.Percentage = Math.floor(this.CurrentIndex / this.TotalData * 100);
    }
    this.SvDefault.ShowSaveCompleteDialogAsync();
  }
  // private parseExcel(file) {
  //   var reader = new FileReader();

  //   reader.onload = (e) => {
  //     let data = e.target.result;
  //     let workbook = XLSX.read(data, {
  //       type: 'binary'
  //     });
  //     if(workbook == null){
  //       return;
  //     }
  //     for (let i = 0; i < workbook.SheetNames.length; i++) {
  //       let sheetName = workbook.SheetNames[i];
  //       let sheet = workbook.Sheets[sheetName];
  //       if(sheet == null){
  //         continue;
  //       }

  //       console.log(sheet);

  //       //let j = 1;
  //       for (let j = 1; sheet["A"+j]; j++) {
  //         let strCompCode = this.SvDefault.GetString( sheet["A"+j].v);
  //         console.log(strCompCode);

  //         if(strCompCode === "" || strCompCode === "รหัสบริษัท" || strCompCode === "COMP_CODE" ){
  //           continue;
  //         }
  //       }
  //     }
  //     workbook.SheetNames.forEach(function(sheetName) {
  //       // Here is your object
  //       // let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  //       // console.log(json);
  //       let sheet = workbook.Sheets[sheetName];

  //       //let c= s['!rows'].length
  //       //console.log(sheet);

  //       // var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
  //       // var json_object = JSON.stringify(XL_row_object);
  //       // console.log(JSON.parse(json_object));
  //     });
  //   }
  //   reader.onerror = function(ex) {
  //     console.log(ex);
  //   };

  //   reader.readAsBinaryString(file);
  // }
  public LoadFile(evt: any) {
    // console.log(evt);
    var files = evt.target.files;
    this.parseExcel(files[0]);
  }

}
