export type MouRecord = {
  slug: string;
  title: string;
  signedOn: string;
  attachmentPath: string;
};

export const mouRecords: MouRecord[] = [
  {
    slug: "iip-mumbai-24-jan-2021",
    title: "ODOP signed an MOU with Indian Institute of Packaging (IIP) Mumbai",
    signedOn: "Jan 24, 2021",
    attachmentPath: "/assets/document/MOUs/MoU%20IIP%2024-June-2021.pdf",
  },
  {
    slug: "aktu-lucknow-06-aug-2020",
    title: "ODOP signed an MOU with Dr. APJ Abdul Kalam Technical University (AKTU) Lucknow",
    signedOn: "Aug 06, 2020",
    attachmentPath: "/assets/document/MOUs/MoU%20AKTU%2006-Aug-2020.pdf",
  },
  {
    slug: "amazon-bangalore-30-jun-2022",
    title: "ODOP signed an MOU with Amazon Seller Services Pvt Ltd. (Amazon) Bangalore",
    signedOn: "Jun 30, 2022",
    attachmentPath: "/assets/document/MOUs/MoU%20Amazon%20Global%20Selling%2030-June-2022.pdf",
  },
  {
    slug: "amazon-bangalore-second-30-jun-2022",
    title: "ODOP signed second MOU with Amazon Seller Services Pvt Ltd. (Amazon) Bangalore",
    signedOn: "Jun 30, 2022",
    attachmentPath: "/assets/document/MOUs/MoU%20Amazon%20II%2030-June-2022.pdf",
  },
  {
    slug: "amazon-bangalore-10-aug-2018",
    title: "ODOP signed an MOU with Amazon Seller Services Pvt Ltd. (Amazon) Bangalore",
    signedOn: "Aug 10, 2018",
    attachmentPath: "/assets/document/MOUs/MoU%20Amazon%2010-Aug-2018.pdf",
  },
  {
    slug: "bank-of-baroda-mumbai-01-oct-2019",
    title: "ODOP signed an MOU with Bank of Baroda (BoB) Mumbai",
    signedOn: "Oct 01, 2019",
    attachmentPath: "/assets/document/MOUs/MoU%20Bank%20of%20Baroda%2001-Oct-2019.pdf",
  },
  {
    slug: "ebay-mumbai-31-jul-2020",
    title: "ODOP signed an MOU with ES Online Services (India) Pvt Ltd (eBay) Mumbai",
    signedOn: "July 31, 2020",
    attachmentPath: "/assets/document/MOUs/MoU%20ebay%2031-July-2020.pdf",
  },
  {
    slug: "flipkart-bengaluru-07-aug-2020",
    title: "ODOP signed an MOU with Flipkart Internet Pvt Ltd. (Flipkart) Bengaluru",
    signedOn: "Aug 07, 2020",
    attachmentPath: "/assets/document/MOUs/MoU%20Filpkart%2007-Aug-2020.pdf",
  },
  {
    slug: "iip-mumbai-27-jun-2023",
    title: "ODOP signed an MOU with Indian Institute of Packaging (IIP) Mumbai",
    signedOn: "Jun 27, 2023",
    attachmentPath: "/assets/document/MOUs/MoU%20IIP%2027-June-2023.pdf",
  },
  {
    slug: "lulu-lucknow-11-jul-2022",
    title: "ODOP signed an MOU with Lulu India Shopping Mall Pvt. Ltd. (Lulu) Lucknow",
    signedOn: "Jul 11, 2022",
    attachmentPath: "/assets/document/MOUs/MoU%20LuLu%2011-July-2022.pdf",
  },
  {
    slug: "paytm-noida-02-jun-2022",
    title: "ODOP signed an MOU with One97 Communication Ltd. (Paytm) Noida",
    signedOn: "Jun 02, 2022",
    attachmentPath: "/assets/document/MOUs/MoU%20Paytm%2002-June-2022.pdf",
  },
  {
    slug: "qci-new-delhi-04-mar-2020",
    title: "ODOP signed an MOU with Quality Council of India (QCI) New Delhi",
    signedOn: "Mar 04, 2020",
    attachmentPath: "/assets/document/MOUs/MoU%20QCI%2004-Mar-2020.pdf",
  },
  {
    slug: "qci-new-delhi-10-aug-2018",
    title: "ODOP signed an MOU with Quality Council of India (QCI) New Delhi",
    signedOn: "Aug 10, 2018",
    attachmentPath: "/assets/document/MOUs/MoU%20QCI%2010-Aug-2018.pdf",
  },
  {
    slug: "sbi-lucknow-24-jan-2021",
    title: "ODOP signed an MOU with State Bank of India (SBI) Lucknow",
    signedOn: "Jan 24, 2021",
    attachmentPath: "/assets/document/MOUs/MoU%20SBI%2024-Jan-2021.pdf",
  },
  {
    slug: "sidbi-lucknow-17-sep-2020",
    title: "ODOP signed an MOU with Small Industries Development Bank of India (SIDBI) Lucknow",
    signedOn: "Sep 17, 2020",
    attachmentPath: "/assets/document/MOUs/MoU%20SIDBI%2017-Sep-2020.pdf",
  },
  {
    slug: "upsrlm-lucknow-24-jan-2020",
    title: "ODOP signed an MOU with State Rural Livelihoods Mission (UPSRLM) Lucknow",
    signedOn: "Jan 24, 2020",
    attachmentPath: "/assets/document/MOUs/MoU%20UPSRLM%2024-Jan-2020.pdf",
  },
];

export function getMouBySlug(slug: string) {
  return mouRecords.find((mou) => mou.slug === slug);
}
