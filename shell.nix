{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  name = "VicoGPT ENV";
  packages = with pkgs; [
    nodejs
    nodePackages_latest.npm
  ];
}
