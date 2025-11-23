import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";
import { InvoicePopulated } from "@/lib/types/invoices";
import { multiply } from "@/lib/helper/smallHelpers";

const styles = StyleSheet.create({
  page: {
    width: 612,
    height: 792,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 32,
  },
  header: {
    width: 612,
    height: 106,
    backgroundColor: "#FFEAF4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    textTransform: "uppercase",
    fontSize: 28,
    fontWeight: 600,
  },
  logo: {
    height: 70,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  leftColumn: {
    width: 80,
    height: 516,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftColumnInner: {
    width: "100%",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
  },
  infoBlock: {
    width: 80,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
  },
  smallValue: {
    fontSize: 8,
    fontWeight: 400,
    color: "#5E6470",
    paddingRight: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: "black",
    marginBottom: 4,
  },
  value: {
    fontSize: 10,
    fontWeight: 400,
    color: "#5E6470",
    paddingRight: 2,
  },
  rightColumn: {
    width: 488,
    height: 516,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    border: "1px solid #FFEAF4",
    borderRadius: 12,
    overflow: "hidden",
    paddingTop: 13,
    gap: 20,
  },
  section: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
    gap: 6,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "black",
  },
  sectionContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
    borderBottom: "1px solid #FFEAF4",
    paddingBottom: 13,
  },
  field25: {
    width: "25%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
  },
  field33: {
    width: "33%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
  },
  fieldAuto: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
  },
  priceSection: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
    gap: 2,
    paddingHorizontal: 12,
  },
  priceRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "black",
  },
  totalBar: {
    width: "100%",
    height: 34,
    backgroundColor: "#FFEAF4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "black",
    paddingHorizontal: 12,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#B32053",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 700,
    color: "#B32053",
  },
});

const InvoicePDF = ({ data }: { data?: InvoicePopulated }) => {
  return (
    <Document>
      <Page size={{ width: 612, height: 792 }} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Invoice</Text>
          <Image src="/logo.png" style={styles.logo} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            <View style={styles.leftColumnInner}>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Invoice #</Text>
                <Text style={styles.smallValue}>{data?.invoicesId}</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Invoice Date</Text>
                <Text style={styles.smallValue}>
                  {moment(data?.createdAt).format("MMM DD, YYYY")}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Booking ID</Text>
                <Text style={styles.smallValue}>
                  {data?.booking?.bookingId}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Tour Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tour Information</Text>
              <View style={styles.sectionContent}>
                <View style={styles.field33}>
                  <Text style={styles.label}>Tour Title</Text>
                  <Text style={styles.value}>{data?.activity.title}</Text>
                </View>
                <View style={styles.fieldAuto}>
                  <Text style={styles.label}>Date & Time</Text>
                  <Text style={styles.value}>
                    {moment(data?.booking.selectDate).format("MMM DD, YYYY")}
                  </Text>
                </View>
                <View style={styles.fieldAuto}>
                  <Text style={styles.label}>Participants</Text>
                  <Text style={styles.value}>
                    {data?.booking.adultsCount} Adults,
                    {data?.booking.childrenCount} Child
                  </Text>
                </View>
              </View>
            </View>

            {/* Traveler Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Traveler Information</Text>
              <View style={styles.sectionContent}>
                <View style={styles.field25}>
                  <Text style={styles.label}>Full Name</Text>
                  <Text style={styles.value}>
                    {data?.booking.travelers[0].fullName}
                  </Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Nationality</Text>
                  <Text style={styles.value}>
                    {data?.booking.travelers[0].nationality}
                  </Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Contact</Text>
                  <Text style={styles.value}>{data?.user?.phoneNumber}</Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{data?.user.email}</Text>
                </View>
              </View>
            </View>

            {/* Vendor Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vendor Information</Text>
              <View style={styles.sectionContent}>
                <View style={styles.field25}>
                  <Text style={styles.label}>Operator</Text>
                  <Text style={styles.value}>
                    {data?.vendor?.vendorDetails?.contactPersonName}
                  </Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>TÜRSAB Number</Text>
                  <Text style={styles.value}>
                    {data?.vendor?.vendorDetails?.tursabNumber}
                  </Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Contact</Text>
                  <Text style={styles.value}>
                    {data?.vendor?.vendorDetails?.contactPhoneNumber}
                  </Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>
                    {data?.vendor?.vendorDetails?.businessEmail}
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Details</Text>
              <View style={styles.sectionContent}>
                <View style={styles.field25}>
                  <Text style={styles.label}>Payment Method</Text>
                  <Text style={styles.value}>MasterCard **** 4421</Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Transaction ID</Text>
                  <Text style={styles.value}>
                    {data?.booking.paymentDetails.paymentIntentId}
                  </Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Currency</Text>
                  <Text style={styles.value}>
                    {data?.booking.paymentDetails.currency}
                  </Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>info@skyadventures.com</Text>
                </View>
              </View>
            </View>

            {/* Price Breakdown */}
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.label}>
                  Base Price ({data?.booking.adultsCount} Adults ×
                  {data?.booking.paymentDetails.currency}
                  {data?.activity.slots[0].adultPrice})
                </Text>
                <Text style={styles.value}>
                  {data?.booking.paymentDetails.currency}
                  {multiply(
                    data?.booking.adultsCount || 0,
                    data?.activity.slots[0].adultPrice || 0
                  )}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.label}>
                  Child Price ({data?.booking.childrenCount} Adults ×
                  {data?.booking.paymentDetails.currency}
                  {data?.activity.slots[0].childPrice})
                </Text>
                <Text style={styles.value}>
                  {data?.booking.paymentDetails.currency}
                  {multiply(
                    data?.booking.childrenCount || 0,
                    data?.activity.slots[0].childPrice || 0
                  )}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.label}>Service Fee</Text>
                <Text style={styles.value}>
                  {data?.booking.paymentDetails.currency}
                  {data?.booking.paymentDetails.amount}
                </Text>
              </View>
            </View>

            {/* Total */}
            <View style={styles.totalBar}>
              <Text style={styles.totalLabel}>Total paid</Text>
              <Text style={styles.totalValue}>
                {data?.booking.paymentDetails.currency}
                {data?.booking.paymentDetails.amount}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
