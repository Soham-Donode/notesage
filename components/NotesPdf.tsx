// components/NotesPdf.tsx
"use client"
import React from 'react';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24 },
  title: { fontSize: 18, marginBottom: 12 },
  paragraph: { fontSize: 12, lineHeight: 1.4, marginBottom: 8 },
  section: { marginBottom: 16 },
});

export const NotesPdf: React.FC<{ title?: string; content: string[] }> = ({ title = 'Notes', content }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {content.map((p, i) => (
        <Text key={i} style={styles.paragraph}>
          {p}
        </Text>
      ))}
    </Page>
  </Document>
);
