import 'package:flutter_test/flutter_test.dart';
import 'package:cv_asia_plastik_attendance/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const CvAsiaPlastikApp());
    await tester.pump(const Duration(milliseconds: 500));
    await tester.pump(const Duration(seconds: 2));
    expect(find.byType(CvAsiaPlastikApp), findsOneWidget);
  });
}
