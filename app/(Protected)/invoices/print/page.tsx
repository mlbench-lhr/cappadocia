import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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

const InvoicePDF = () => {
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
                <Text style={styles.value}>INV-001245</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Invoice Date</Text>
                <Text style={styles.value}>12 Oct 2025</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Booking ID</Text>
                <Text style={styles.value}>BK-000789</Text>
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
                  <Text style={styles.value}>Hot Air Balloon Sunrise Ride</Text>
                </View>
                <View style={styles.fieldAuto}>
                  <Text style={styles.label}>Date & Time</Text>
                  <Text style={styles.value}>14 Oct 2025|05:15 AM</Text>
                </View>
                <View style={styles.fieldAuto}>
                  <Text style={styles.label}>Participants</Text>
                  <Text style={styles.value}>2 Adults, 1 Child</Text>
                </View>
              </View>
            </View>

            {/* Traveler Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Traveler Information</Text>
              <View style={styles.sectionContent}>
                <View style={styles.field25}>
                  <Text style={styles.label}>Full Name</Text>
                  <Text style={styles.value}>Sarah Mitchell</Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Nationality</Text>
                  <Text style={styles.value}>United Kingdom</Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Contact</Text>
                  <Text style={styles.value}>+90 384 555 9876</Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>info@skyadventures.com</Text>
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
                    Cappadocia Sky Adventures Cappadocia Sky Adventures
                  </Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>TÜRSAB Number</Text>
                  <Text style={styles.value}>43455</Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Contact</Text>
                  <Text style={styles.value}>+90 384 555 9876</Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>info@skyadventures.com</Text>
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
                  <Text style={styles.value}>TXN-568742195</Text>
                </View>
                <View style={styles.field25}>
                  <Text style={styles.label}>Currency</Text>
                  <Text style={styles.value}>€ (Euro)</Text>
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
                <Text style={styles.label}>Base Price (2 Adults × €160)</Text>
                <Text style={styles.value}>$9,000.00</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.label}>Child Price (1 × €100)</Text>
                <Text style={styles.value}>$9,000.00</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.label}>Service Fee</Text>
                <Text style={styles.value}>$9,000.00</Text>
              </View>
            </View>

            {/* Total */}
            <View style={styles.totalBar}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>$9,000.00</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
