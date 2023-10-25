export class ModelGetCustomerLisParam{
  public CompCode : string = "";
  public BrnCode : string = "";
  public KeyWord : string = "";
  public ItemPerPage : number = 0;
  public PageIndex : number = 0;
}

export class ModelGetCustomerListResult{
  public ArrCustomer : ModelMasCustomer2[] = [];
  public TotalItem : number = 0;
}

export class ModelCustomer{
  public Customer : ModelMasCustomer2 = new ModelMasCustomer2();
  public ArrCustomerCar : ModelMasCustomerCar2[] = []
}

export class ModelMasCustomer2 {
	AccountId : string = "";
	Address : string = "";
	BillType : string = "";
	BrnCode : string = "";
	CitizenId : string = "";
	CompCode : string = "";
	ContactName : string = "";
	CountryCode : string = "";
	CountryName : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CreditLimit : number = 0;
	CreditTerm : number = 0;
	CustCode : string = "";
	CustName : string = "";
	CustPrefix : string = "";
	CustStatus : string = "";
	District : string = "";
	DueType : string = "";
	Fax : string = "";
	Guid : string = null;
	MapCustCode : string = "";
	Phone : string = "";
	Postcode : string = "";
	ProvCode : string = "";
	ProvName : string = "";
	SubDistrict : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasCustomerCar2 {
	CarStatus : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CustCode : string = "";
	LicensePlate : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
