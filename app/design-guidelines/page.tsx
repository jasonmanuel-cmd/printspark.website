import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DesignGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Design Guidelines</h1>
          <p className="text-xl text-gray-600">
            Ensure your print files are production-ready with these best practices
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Requirements</CardTitle>
              <CardDescription>Accepted formats and specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Accepted File Formats</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>PDF (preferred)</li>
                    <li>Adobe Illustrator (.ai)</li>
                    <li>Adobe Photoshop (.psd)</li>
                    <li>Encapsulated PostScript (.eps)</li>
                    <li>JPEG (.jpg, .jpeg)</li>
                    <li>PNG (.png)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Resolution</h3>
                  <p className="text-gray-600">
                    Minimum 300 DPI (dots per inch). Lower resolutions may result in pixelated output.
                    Vector files (PDF, AI, EPS) are preferred for the sharpest results.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Max file size:</strong> 50MB. For larger files, contact us for alternative upload options.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Always design in <strong>CMYK</strong> color mode for the most accurate print results.
                RGB files will be converted to CMYK during processing, which may cause slight color shifts.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-1">✓ Recommended: CMYK</h4>
                  <p className="text-sm text-green-700">
                    Most accurate color reproduction for professional printing
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-1">✗ Avoid: RGB</h4>
                  <p className="text-sm text-red-700">
                    Colors may appear differently when converted to CMYK
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bleed & Safety Margins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-1">Bleed Area</h4>
                <p className="text-gray-600">
                  Extend your background/colors 0.125 inches beyond the final trim line on all sides.
                  This ensures no white edges after cutting.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold mb-1">Safety Margin</h4>
                <p className="text-gray-600">
                  Keep all important content (text, logos) at least 0.125 inches inside the trim line
                  to prevent anything from being cut off.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text & Fonts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Convert fonts to outlines/curves</strong> — This prevents font substitution issues if we don't have the same fonts installed.</li>
                <li><strong>Minimum text size</strong> — 6pt for standard print, 8pt for reverse (white on dark) text.</li>
                <li>For multi-page documents, embed all fonts in your PDF export.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pre-Flight Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Before submitting your files, verify:</p>
              <ul className="space-y-2 text-gray-600">
                <li><strong>✓</strong> File is in CMYK color mode</li>
                <li><strong>✓</strong> Resolution is 300 DPI or higher</li>
                <li><strong>✓</strong> Bleed is set to 0.125 inches on all sides</li>
                <li><strong>✓</strong> Text is converted to outlines or fonts are embedded</li>
                <li><strong>✓</strong> All images are linked or embedded (not missing)</li>
                <li><strong>✓</strong> Final file size is under 50MB</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Need design help?</h3>
              <p className="text-gray-600 mb-4">
                We offer professional design services starting at just $49
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/products">Start Your Order</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Get Design Help</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
